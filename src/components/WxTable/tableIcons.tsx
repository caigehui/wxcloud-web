import React, { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Replay from '@material-ui/icons/Replay';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox color="primary" {...props} {...({ ref } as any)} />),
  Check: forwardRef((props, ref) => <Check {...props} {...({ ref } as any)} />),
  Clear: forwardRef((props, ref) => <Clear {...props} {...({ ref } as any)} />),
  Delete: forwardRef((props, ref) => (
    <DeleteOutline color="primary" {...props} {...({ ref } as any)} />
  )),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} {...({ ref } as any)} />),
  Edit: forwardRef((props, ref) => <Edit color="primary" {...props} {...({ ref } as any)} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} {...({ ref } as any)} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} {...({ ref } as any)} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} {...({ ref } as any)} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} {...({ ref } as any)} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} {...({ ref } as any)} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} {...({ ref } as any)} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} {...({ ref } as any)} />),
  Search: forwardRef((props, ref) => <Search {...props} {...({ ref } as any)} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} {...({ ref } as any)} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} {...({ ref } as any)} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} {...({ ref } as any)} />),
  Retry: forwardRef((props, ref) => <Replay {...props} {...({ ref } as any)} />),
};

export default tableIcons;
