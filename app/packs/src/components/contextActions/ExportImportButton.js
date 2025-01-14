import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';

import CollectionActions from 'src/stores/alt/actions/CollectionActions';
import ElementActions from 'src/stores/alt/actions/ElementActions';
import ModalImport from 'src/components/contextActions/ModalImport';
import ModalExport from 'src/components/contextActions/ModalExport';
import ModalReactionExport from 'src/components/contextActions/ModalReactionExport';
import ModalExportCollection from 'src/components/contextActions/ModalExportCollection';
import ModalImportCollection from 'src/components/contextActions/ModalImportCollection';

const ExportImportButton = ({ isDisabled, updateModalProps, customClass }) => (
  <Dropdown id='export-dropdown'>
    <Dropdown.Toggle className={customClass}>
      <Glyphicon glyph="import" /> <Glyphicon glyph="export" />
    </Dropdown.Toggle>
    <Dropdown.Menu>
      <MenuItem onSelect={() => exportFunction(updateModalProps)}
        title='Export to spreadsheet'>
        Export samples from selection
      </MenuItem>
      <MenuItem onSelect={() => exportReactionFunction(updateModalProps)}
        title='Export reaction smiles to csv'>
        Export reactions from selection
      </MenuItem>
      <MenuItem divider />
      <MenuItem onSelect={() => importSampleFunction(updateModalProps)} disabled={isDisabled}
        title='Import from spreadsheet or sdf'>
        Import samples to collection
      </MenuItem>
      <MenuItem divider />
      <MenuItem onSelect={() => exportCollectionFunction(updateModalProps)}
        title='Export as ZIP archive'>
        Export collections
      </MenuItem>
      <MenuItem onSelect={() => importCollectionFunction(updateModalProps)}
        title='Import collections from ZIP archive'>
        Import collections
      </MenuItem>
    </Dropdown.Menu>
  </Dropdown>
);

ExportImportButton.propTypes = {
  isDisabled: PropTypes.bool,
  customClass: PropTypes.string,
};

ExportImportButton.defaultProps = {
  isDisabled: false,
  customClass: null,
};

const importSampleFunction = (updateModalProps) => {
  const title = "Import Samples from File";
  const component = ModalImport;
  const action = ElementActions.importSamplesFromFile;
  const listSharedCollections = false;
  const modalProps = {
    show: true,
    title,
    component,
    action,
    listSharedCollections,
  };
  updateModalProps(modalProps);
};

const exportFunction = (updateModalProps) => {
  const title = "Select Data to Export";
  const component = ModalExport;
  const modalProps = {
    show: true,
    title,
    component,
    customModal: "exportModal"
  };
  updateModalProps(modalProps);
}

const exportReactionFunction = (updateModalProps) => {
  const component = ModalReactionExport;
  const modalProps = {
    show: true,
    title: "Reaction Smiles Export",
    component,
    customModal: "exportModal"
  };
  updateModalProps(modalProps);
}

const exportCollectionFunction = (updateModalProps) => {
  const title = "Export Collections as ZIP archive";
  const component = ModalExportCollection;
  const action = CollectionActions.exportCollectionsToFile;
  const full = false;
  const listSharedCollections = false;

  const modalProps = {
    show: true,
    title,
    component,
    action,
    full,
    listSharedCollections,
  };

  updateModalProps(modalProps);
}

const importCollectionFunction = (updateModalProps) => {
  const title = "Import Collections from ZIP archive";
  const component = ModalImportCollection;
  const action = CollectionActions.importCollectionsFromFile;
  const listSharedCollections = false;

  const modalProps = {
    show: true,
    title,
    component,
    action,
    listSharedCollections,
  };

  updateModalProps(modalProps);
};

export default ExportImportButton
