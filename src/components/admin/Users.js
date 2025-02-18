import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAppError } from "@/context/ErrorContext";
import { useConfirmDialogContext } from "@/context/ConfirmDialog";
const { Checkbox } = require("@mui/material");

const getUserRowId = (row) => {
  return row.email;
};

function RenderCheckBox(props) {
  const [checked, setChecked] = useState(props.value); // Initiated react binded value with param from `rows`

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  // The bind for dynamic mark/unmark: checked={checked}
  // The handler for user clicks: onChange={handleChange}
  return (
    <Checkbox
      label="some text"
      size="lg"
      checked={checked}
      onChange={handleChange}
    />
  );
}

export default function Users({
  users,
  updateUsers,
  openUserEditDialog,
  setFocusedUser,
}) {
  const { showMessage } = useAppError();
  const ConfirmDialog = useConfirmDialogContext();
  const [deleteId, setDeleteId] = useState(null);

  const userColumns = [
    {
      field: "id",
      headerName: "#",
      filterable: false,
      renderCell: (index) =>
        index.api.getRowIndexRelativeToVisibleRows(index.row.email) + 1,
      width: 50,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
    },
    {
      field: "created_at",
      headerName: "Created At",
      width: 200,
      valueGetter: (params) => {
        return new Date(params.row.created_at).toLocaleString();
      },
    },
    {
      field: "role",
      headerName: "Role",
    },
    {
      field: "can_createuser",
      headerName: "can_createuser",
      renderCell: RenderCheckBox,
    },
    {
      headerName: "Actions",
      type: "actions",
      field: "actions",
      width: 100,
      cellClassName: "actions",
      getActions: (props) => {
        return [
          <GridActionsCellItem
            key={props.id}
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(props)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={props.id + "1"}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(props)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const deleteFirebaseDoc = async (props) => {
    await deleteDoc(doc(db, "users", props.row.email));
    await updateUsers();
    showMessage("User deleted !", "info");
    setDeleteId(null);
  };

  const handleDeleteClick = (props) => async () => {
    try {
      setDeleteId(props);
      ConfirmDialog.setCurrent("Users");
      ConfirmDialog.setDialogTitle(`Delete user ?`);
      ConfirmDialog.setDialogContent(
        `Confirm to delete user: ${props.row.email}`,
      );
      ConfirmDialog.handleClickOpen();
    } catch (error) {
      showMessage(error.message, "error");
      setDeleteId(null);
    }
  };

  const handleEditClick = (props) => async () => {
    setFocusedUser(users.filter((u) => u.email === props.row.email)[0]);
    console.log(users.filter((u) => u.email === props.row.email)[0]);
    openUserEditDialog();
  };

  useEffect(() => {
    if (ConfirmDialog.confirm && ConfirmDialog.current === "Users") {
      deleteFirebaseDoc(deleteId);
    }
  }, [ConfirmDialog.confirm]);

  return (
    <DataGrid
      rows={users}
      columns={userColumns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 5,
          },
        },
      }}
      pageSizeOptions={[5]}
      getRowId={getUserRowId}
    />
  );
}
