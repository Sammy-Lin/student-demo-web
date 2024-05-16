import React, { useState, useEffect } from 'react';
import axios from 'api/aixos';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Pagination,
  Snackbar,
  Alert,
  DialogContentText
} from '@mui/material';
import PropTypes from 'prop-types';
import { toInteger, toNumber } from 'lodash';


function ClassPage() {
  const [open, setOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [dataList, setDataList] = useState([]);
  const [currentRow, setCurrentRow] = useState({
    id: '',
    name: '',
    gradeNo: '',
    clazzNo: '',
    gmtCreate: '',
    gmtModified: '',
  });

  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalPage, setTotalPage] = React.useState(10);
  const [showAlert, setShowAlert] = React.useState(false);
  const [serverity, setServerity] = React.useState('success');
  const [alertMsg, setAlertMsg] = React.useState('');
  const [deleteId, setDeleteId] = React.useState();
  const [deleteDialog, setDeleteDialog] = React.useState(false);

  useEffect(() => {
    getDataList();
  }, []);

  useEffect(() => {
    getDataList();
  }, [page]);

  const getDataList = () => {
    axios.get(`clazz/listClazzs?current=${page}&pageSize=${rowsPerPage}`)
      .then(response => {
        let pageData = response.data.data;
        setTotal(pageData.total);
        setDataList(pageData.list);
        let pages = 0;
        if (pageData.total % rowsPerPage == 0) {
          pages = pageData.total / rowsPerPage;
        } else {
          pages = toInteger(pageData.total / rowsPerPage) + 1;
        }
        setTotalPage(pages);
      }
      ).catch(error => console.error('Error fetching data:', error));
  };

  const handleClickOpen = (row = { id: '', name: '', gradeNo: '', clazzNo: '', gmtCreate: '', gmtModified: '' }) => {
    setCurrentRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCurrentRow({ ...currentRow, [name]: value });
  };

  const handleSave = () => {
    if (currentRow.id) {
      // 更新
      axios.post(`clazz/updateClazz`, currentRow)
        .then(response => {
          let resp = response.data;
          setShowAlert(true);
          if (resp.code === 2000) {
            const updatedData = dataList.map((row) => (row.id === resp.data.id ? resp.data : row));
            setDataList(updatedData);
            setAlertMsg('操作成功');
            return;
          }
          setServerity('error');
          setAlertMsg(resp.message);
        }
        ).catch(error => console.error('Error updating data:', error));

    } else {
      // 新增
      axios.post(`clazz/addClazz`, currentRow)
        .then(response => {
          let resp = response.data;
          if (resp.code === 2000) {
            setServerity('success');
            setAlertMsg('操作成功');
            setShowAlert(true);
            const updatedData = [...dataList, resp.data]
            setDataList(updatedData);
            return;
          }
          setServerity('error');
          setAlertMsg(resp.message);
          setShowAlert(true);
        }
        ).catch(error => console.error('Error saving data:', error));
    }
    handleClose();
  };

  const handleDeleteDialog = (id) => {
    setDeleteDialog(true);
    setDeleteId(id);
  };

  const handleDelete = () => {
    // 删除
    let delIds = [deleteId];
    console.log(delIds);
    axios.delete(`clazz/delClazzs?ids=${delIds}`)
      .then(response => {
        let resp = response.data;
        setShowAlert(true);
        if (resp.code === 2000) {
          let data = dataList.filter(row => row.id != deleteId);
          setDataList(data);
          return;
        }
        setServerity('error');
        setAlertMsg(resp.message);
      }).catch(error => console.error('Error saving data:', error));
    handleCloseDeleteDialog();
  };

  const handleChangePage = (event, page) => {
    setPage(page);
  }

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowAlert(false);
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialog(false);
    setDeleteId();
    console.log(deleteId);
  }



  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => handleClickOpen()}>
        Add
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>编号</TableCell>
              <TableCell>年级</TableCell>
              <TableCell>班级</TableCell>
              <TableCell>创建时间</TableCell>
              <TableCell>更新时间</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataList.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.gradeNo}</TableCell>
                <TableCell>{row.clazzNo}</TableCell>
                <TableCell>{row.gmtCreate}</TableCell>
                <TableCell>{row.gmtModified}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleClickOpen(row)}>
                    编辑
                  </Button>

                  <Button variant="contained" color="error" onClick={() => handleDeleteDialog(row.id)}>
                    删除
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <Pagination count={totalPage} page={page} onChange={handleChangePage} />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentRow.id ? 'Edit Class' : 'Add Class'}</DialogTitle>
        <DialogContent>
          {/* <TextField
            margin="dense"
            name="name"
            label="Name"
            fullWidth
            value={currentRow.name}
            onChange={handleChange}
          /> */}
          <TextField
            margin="dense"
            name="gradeNo"
            label="Grade No"
            fullWidth
            type="number"
            value={currentRow.gradeNo}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="clazzNo"
            label="Clazz No"
            fullWidth
            type="number"
            value={currentRow.clazzNo}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={showAlert} autoHideDuration={2000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={handleCloseAlert}>
        <Alert severity={serverity}>
          {alertMsg}
        </Alert>
      </Snackbar>

      <Dialog
        open={deleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"提示"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            确认删除?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            取消
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ClassPage;