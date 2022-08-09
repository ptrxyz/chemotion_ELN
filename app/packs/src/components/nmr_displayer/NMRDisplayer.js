import React from 'react';
import base64 from 'base-64';
import SpectraStore from 'src/stores/alt/stores/SpectraStore';
import SpectraActions from 'src/stores/alt/actions/SpectraActions';
import LoadingActions from 'src/stores/alt/actions/LoadingActions';
import { Modal, Button } from 'react-bootstrap';
import UIFetcher from 'src/fetchers/UIFetcher';
import { parseBase64ToArrayBuffer } from 'src/utilities/FetcherHelper';
import Attachment from 'src/models/Attachment';
import ElementActions from 'src/stores/alt/actions/ElementActions';
import { SpectraOps } from 'src/utilities/quillToolbarSymbol';

export default class NMRDisplayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...SpectraStore.getState(),
      nmriumData: null,
    };

    this.iframeRef = React.createRef();

    this.onChange = this.onChange.bind(this);
    this.receiveMessage = this.receiveMessage.bind(this);
    this.handleNMRDisplayerLoaded = this.handleNMRDisplayerLoaded.bind(this);
    this.sendJcampDataToNMRDisplayer = this.sendJcampDataToNMRDisplayer.bind(this);
    this.loadNMRDisplayerHostInfo = this.loadNMRDisplayerHostInfo.bind(this);
    this.requestDataToBeSaved = this.requestDataToBeSaved.bind(this);
    this.requestPreviewImage = this.requestPreviewImage.bind(this);
    this.savingNMRiumWrapperData = this.savingNMRiumWrapperData.bind(this);
    this.saveOp = this.saveOp.bind(this);

    this.loadNMRDisplayerHostInfo();
  }

  componentDidMount() {
    SpectraStore.listen(this.onChange);

    window.addEventListener("message", this.receiveMessage)
  }

  componentWillUnmount() {
    SpectraStore.unlisten(this.onChange);
  }

  onChange(newState) {
    const origState = this.state;
    this.setState({ ...origState, ...newState });
    this.sendJcampDataToNMRDisplayer();
  }

  loadNMRDisplayerHostInfo() {
    UIFetcher.fetchNMRDisplayerHost().then((response) => {
      const {protocol, url, port} = response;
      let nmriumWrapperHost = protocol + '://' + url;
      if (port) {
        nmriumWrapperHost += ':' + port;
      }
      this.setState({nmriumWrapperHost});
    });
  }

  getSpcInfo() {
    const { spcInfos, spcIdx } = this.state;
    const sis = spcInfos.filter(x => x.idx === spcIdx);
    const si = sis.length > 0 ? sis[0] : spcInfos[0];
    return si;
  }

  receiveMessage(event) {
    const { nmriumWrapperHost } = this.state;
    if (nmriumWrapperHost === undefined || nmriumWrapperHost === '') {
      return;
    }
    
    if (event.origin === nmriumWrapperHost && event.data) {
      const eventData = event.data;
      const eventDataType = eventData.type;
      
      if (eventDataType === 'nmr-wrapper:data-change') {
        const nmrWrapperActionType = eventData.data.actionType;
        if (nmrWrapperActionType !== '') {
          const nmriumData = eventData.data;
          this.setState({ nmriumData });
        }
      }
      else if (eventDataType === 'nmr-wrapper:action-response') {
        const nmrWrapperDataType = eventData.data.type;
        if (nmrWrapperDataType === "exportSpectraViewerAsBlob") {
          const blobData = eventData.data.data.blob;
          this.savingNMRiumWrapperData(blobData);
        }
      }
    }
  }

  requestDataToBeSaved() {
    this.requestPreviewImage();
  }

  requestPreviewImage() {
    const iframeCurrent = this.iframeRef.current;
    if (!iframeCurrent) {
      return;
    }
    const contentWindow = iframeCurrent.contentWindow;
    const dataToBeSent = {
      type: "exportSpectraViewerAsBlob",
    };
    contentWindow.postMessage({ type: 'nmr-wrapper:action-request', data: dataToBeSent }, '*');
  }

  
  handleNMRDisplayerLoaded() {
    const isIframeLoaded = true;
    this.setState({
      isIframeLoaded,
    }, () => {
      this.sendJcampDataToNMRDisplayer();
    });
  }

  sendJcampDataToNMRDisplayer() {
    LoadingActions.start.defer();
    const { fetchedFiles, isIframeLoaded, spcInfos } = this.state;
    if (isIframeLoaded && fetchedFiles && fetchedFiles.files && fetchedFiles.files.length > 0) {
      LoadingActions.stop.defer();
      
      const listFileContents = fetchedFiles.files;
      if (this.iframeRef.current && listFileContents.length > 0 && listFileContents.length === spcInfos.length) {
        const dataToBeSent = this.buildDataToBeSent(listFileContents, spcInfos);
        const contentWindow = this.iframeRef.current.contentWindow;
        if (contentWindow) {
          contentWindow.postMessage({ type: 'nmr-wrapper:load', data: dataToBeSent }, '*');
        }
        
      }
    }
    else {
      LoadingActions.stop.defer();
    }
  }

  buildDataToBeSent(files, spectraInfos) {
    const nmriumData = this.readNMRiumData(files, spectraInfos);
    if (nmriumData) {
      const data = { data: nmriumData, type: "nmrium" };
      return data;
    }
    else {
      let data = { data: [], type: "file" };
      for (let index = 0; index < files.length; index++) {
        const fileToBeShowed = files[index].file;
        const bufferData = parseBase64ToArrayBuffer(fileToBeShowed);
        const spcInfo = spectraInfos[index];
        const fileName = spcInfo.label;
        const dataItem = { data: bufferData, name: fileName };
        data['data'].push(dataItem);
      }
      return data;
    }
  }

  readNMRiumData(files, spectraInfos) {
    const arrNMRiumSpecs = spectraInfos.filter(spc => spc.label.includes(".nmrium"));
    if (!arrNMRiumSpecs || arrNMRiumSpecs.length === 0) {
      return false;
    }

    const nmriumSpec = arrNMRiumSpecs[0];

    const arrNMRiumFiles = files.filter(file => file.id === nmriumSpec.idx);
    if (!arrNMRiumFiles || arrNMRiumFiles.length === 0) {
      return false;
    }

    const nmriumDataEncoded = arrNMRiumFiles[0].file;
    const decodedData = base64.decode(nmriumDataEncoded);
    const nmriumData = JSON.parse(decodedData);
    return nmriumData;
  }

  savingNMRiumWrapperData(imageBlobData = false) {
    const { nmriumData } = this.state;
    if (nmriumData === null || !imageBlobData) {
      return;
    }

    const specInfo = this.getSpcInfo();

    const { label } = specInfo;
    const specLabelParts = label.split('.');
    const fileNameWithoutExt = specLabelParts[0];

    const imageAttachment = this.prepareImageAttachment(imageBlobData, fileNameWithoutExt);
    const nmriumAttachment = this.prepareNMRiunDataAttachment(nmriumData, fileNameWithoutExt);
    const listFileNameToBeDeleted = [imageAttachment.filename, nmriumAttachment.filename];
    let datasetToBeUpdated = this.prepareDatasets(listFileNameToBeDeleted);
    if (!datasetToBeUpdated) {
      return;
    }

    this.prepareAnalysisMetadata(nmriumData);

    const { sample, handleSampleChanged } = this.props;

    datasetToBeUpdated.attachments.push(imageAttachment);
    datasetToBeUpdated.attachments.push(nmriumAttachment);

    const cb = () => (
      this.saveOp(sample)
    );
    handleSampleChanged(sample, cb);
  }

  prepareDatasets(fileNameToBeDeleted = []) {
    const specInfo = this.getSpcInfo();
    const { sample } = this.props;

    const datasetContainers = sample.datasetContainers();
    const listDatasetFiltered = datasetContainers.filter(e => specInfo.idDt === e.id);
    if (listDatasetFiltered.length === 0) {
      return false;
    }

    let datasetToBeUpdated = listDatasetFiltered[0];
    const datasetAttachments = datasetToBeUpdated.attachments;
    datasetAttachments.forEach(att => {
      if (fileNameToBeDeleted.includes(att.filename)) {
        att.is_deleted = true;
      }
    });
    datasetToBeUpdated.attachments = datasetAttachments
    return datasetToBeUpdated;
  }

  prepareNMRiunDataAttachment(nmriumData, fileNameNoExt) {
    const spaceIndent = 0;
    const dataAsJson = JSON.stringify(
      nmriumData,
      (key, value) =>
        ArrayBuffer.isView(value) ? Array.from(value) : value,
        spaceIndent,
    );
    let blobData = new Blob([dataAsJson], {type : 'text/plain'});
    const fileName = `${fileNameNoExt}.nmrium`;
    blobData.name = fileName;
    const dataAttachment = Attachment.fromFile(blobData);
    return dataAttachment;
  }

  prepareImageAttachment(blobData, fileNameNoExt) {
    const fileName = `${fileNameNoExt}.svg`;
    let blobDataToBeSaved = blobData;
    blobDataToBeSaved.name = fileName;
    const imageAttachment = Attachment.fromFile(blobDataToBeSaved);
    imageAttachment.thumb = true;
    return imageAttachment;
  }

  prepareAnalysisMetadata(nmriumData) {
    const { preferences } = nmriumData;
    const layout = preferences.activeTab;

    const { sample } = this.props;
    const specInfo = this.getSpcInfo();

    const analysesContainers = sample.analysesContainers();

    const layoutOpsObj = SpectraOps[layout];
    const ops = [
      ...layoutOpsObj.head(''),
      { insert: '' },
      ...layoutOpsObj.tail(),
    ];
    analysesContainers.forEach((analyses) => {
      if (analyses.id !== specInfo.idAe) return;
      analyses.children.forEach((ai) => {
        if (ai.id !== specInfo.idAi) return;
        ai.extended_metadata.content.ops = [ // eslint-disable-line
          ...ai.extended_metadata.content.ops,
          ...ops,
        ];
      }); 
    });
  }

  saveOp(sample) {
    ElementActions.updateSample(sample);
    SpectraActions.ToggleModalNMRDisplayer.defer();
    const specInfo = this.getSpcInfo();

    // console.log('specinfo');
    // console.log(sample);
    // console.log('===========');
  }

  renderNMRium(nmriumWrapperHost) {
    return (
      <Modal.Body>
        <iframe id="nmrium_wrapper" className="spectra-editor" 
          src={nmriumWrapperHost}
          allowFullScreen={true}
          ref={this.iframeRef}
          onLoad={this.handleNMRDisplayerLoaded}></iframe>
      </Modal.Body>
    )
  }

  renderModalTitle() {
    return (
      <Modal.Header>
        <Button
          bsStyle="danger"
          bsSize="small"
          className="button-right"
          onClick={() => {
            SpectraActions.ToggleModalNMRDisplayer.defer();
          }}
        >
          <span>
            <i className="fa fa-times" /> Close without Save
          </span>
        </Button>
        <Button
          bsStyle="danger"
          bsSize="small"
          className="button-right"
          onClick={() => this.requestDataToBeSaved()}
        >
          <span>
            <i className="fa fa-times" /> Save and Close
          </span>
        </Button>
      </Modal.Header>
    )
  }

  render() {
    const { showModalNMRDisplayer, nmriumWrapperHost } = this.state;

    return (
      <div className="spectra-editor">
        <Modal
          show={showModalNMRDisplayer}
          dialogClassName="spectra-editor-dialog"
          animation
          onHide={this.closeOp}
        >
          {this.renderModalTitle()}
          {this.renderNMRium(nmriumWrapperHost)}
        </Modal>
      </div>
    )
  }
}