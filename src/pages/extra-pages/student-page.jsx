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
  DialogContentText,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  InputLabel,
  Select
} from '@mui/material';
import { toInteger } from 'lodash';
import { width } from '@mui/system';

function StudentPage() {
  const [open, setOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [dataList, setDataList] = useState([]);
  const [currentRow, setCurrentRow] = useState({
    id: '',
    name: '',
    clazzId: '',
    gender: true,
    gmtCreate: '',
    gmtModified: ''
  });

  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalPage, setTotalPage] = React.useState(0);
  const [showAlert, setShowAlert] = React.useState(false);
  const [serverity, setServerity] = React.useState('success');
  const [alertMsg, setAlertMsg] = React.useState('');
  const [deleteId, setDeleteId] = React.useState();
  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [selectionData, setSelectionData] = React.useState({});

  useEffect(() => {
    getClazzSelectionData();
  }, []);

  useEffect(() => {
    getDataList();
  }, [page]);

  const getDataList = () => {
    axios
      .get(`student/listStudents?current=${page}&pageSize=${rowsPerPage}`)
      .then((response) => {
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
      })
      .catch((error) => console.error('Error fetching data:', error));
  };

  const handleClickOpen = (row = { id: '', name: '', gender: '', gmtCreate: '', gmtModified: '' }) => {
    setCurrentRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log('name : ', name, 'value: ', value);
    setCurrentRow({ ...currentRow, [name]: value });
  };

  const handleSave = () => {
    if (currentRow.id) {
      // 更新
      axios
        .post(`student/updateStudent`, currentRow)
        .then((response) => {
          let resp = response.data;
          setShowAlert(true);
          if (resp.code === 2000) {
            getDataList();
            setAlertMsg('操作成功');
            return;
          }
          setServerity('error');
          setAlertMsg(resp.message);
        })
        .catch((error) => console.error('Error updating data:', error));
    } else {
      // 新增
      axios
        .post(`student/addStudent`, currentRow)
        .then((response) => {
          let resp = response.data;
          if (resp.code === 2000) {
            setServerity('success');
            setAlertMsg('操作成功');
            setShowAlert(true);
            if (page == totalPage) {
              const updatedData = [...dataList, resp.data];
              setDataList(updatedData);
            }
            return;
          }
          setServerity('error');
          setAlertMsg(resp.message);
          setShowAlert(true);
        })
        .catch((error) => console.error('Error saving data:', error));
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
    axios
      .delete(`student/delStudents?ids=${delIds}`)
      .then((response) => {
        let resp = response.data;
        setShowAlert(true);
        if (resp.code === 2000) {
          let data = dataList.filter((row) => row.id != deleteId);
          setDataList(data);
          return;
        }
        setServerity('error');
        setAlertMsg(resp.message);
      })
      .catch((error) => console.error('Error saving data:', error));
    handleCloseDeleteDialog();
  };

  const handleChangePage = (event, page) => {
    setPage(page);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowAlert(false);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog(false);
    setDeleteId();
  };

  const getClazzSelectionData = () => {
    axios
      .post(`clazz/selection`)
      .then((response) => {
        let resp = response.data;
        if (resp.code === 2000) {
          let data = resp.data;
          setSelectionData(data);
          return;
        }
      })
      .catch((error) => console.error('Error saving data:', error));
  };

  const clazzSelectionData = Object.keys(selectionData).map((item) => {
    return (
      <option key={item.key} value={item}>
        {selectionData[item]}
      </option>
    );
  });

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
              <TableCell>姓名</TableCell>
              <TableCell>性别</TableCell>
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
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.gender ? '男' : '女'}</TableCell>
                <TableCell>{row.gradeNo && row.clazzNo ? row.gradeNo + '年' + row.clazzNo + '班' : '无'}</TableCell>
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
          <TextField margin="dense" name="name" label="姓名" fullWidth value={currentRow.name} onChange={handleChange} />
          <FormControl component="fieldset">
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup row aria-label="gender" name="gender" value={currentRow.gender} onChange={handleChange}>
              <FormControlLabel value={false} control={<Radio />} label="Female" />
              <FormControlLabel value={true} control={<Radio />} label="Male" />
            </RadioGroup>
          </FormControl>
          <br />
          <FormControl style={{ width: 100 + 'px' }}>
            <InputLabel>所属班级</InputLabel>
            <Select native value={currentRow.clazzId} name="clazzId" onChange={handleChange}>
              <option aria-label="None" value="" />
              {clazzSelectionData}
            </Select>
          </FormControl>
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
      <Snackbar
        open={showAlert}
        autoHideDuration={2000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        onClose={handleCloseAlert}
      >
        <Alert severity={serverity}>{alertMsg}</Alert>
      </Snackbar>

      <Dialog
        open={deleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'提示'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">确认删除?</DialogContentText>
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

export default StudentPage;
