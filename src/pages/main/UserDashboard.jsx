import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Modal,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SchoolIcon from '@mui/icons-material/School';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import GradeIcon from '@mui/icons-material/Grade';
import EventIcon from '@mui/icons-material/Event';
import { api } from '../../api/api';
import StudentRankList from './StudentRankList';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const { t } = useTranslation();
  const [studentList, setStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [gradYearStruct, setGradYearStruct] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchStudentList = async () => {
      try {
        const response = await api.post(`/student/get/list/userid/` + currentUser?.id);
        if (!response?.data?.code) {
          setStudentList(response?.data);
        } else {
          console.error('Error fetching student list:', response?.data?.status?.message);
        }
      } catch (error) {
        console.error('Error fetching student list:', error);
      }
    };

    const fetchDashboardData = async () => {
      try {
        const response = await api.post(`/dashboard/get/user-id/${currentUser?.id}`);
        if (response?.data?.status?.code === "0") {
          setDashboardData(response?.data?.data);
        } else {
          console.error('Error fetching dashboard data:', response?.data?.status?.message);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    }

    fetchStudentList();
    fetchDashboardData();
    if (currentUser?.role === 'student_affairs') {
      fetchGradYearStruct();
    }

  }, []);

  const handleView = (student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  const fetchGradYearStruct = async () => {
    const response = await api.post(`/graduation-year/get`);
    console.log('Graduation year struct response:', response);
    if (response?.data?.status?.code === "0") {
      const gradYearStruct = response?.data?.graduation_years[0];
      setGradYearStruct(gradYearStruct);
    }
  }

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedStudent(null);
  };

  const handleApplyAll = async () => {
    try {
      var pendingStudentsIndexes = [];
      switch (currentUser?.role) {
        case 'student_affairs':
          pendingStudentsIndexes = studentList.map((student, index) => student.graduation_status.is_std_aff_confirmed === 2 ? index : null).filter(index => index !== null);
          break;
        case 'advisor':
          pendingStudentsIndexes = studentList.map((student, index) => student.graduation_status.is_advisor_confirmed === 2 ? index : null).filter(index => index !== null);
          break;
        case 'department_secretary':
          pendingStudentsIndexes = studentList.map((student, index) => student.graduation_status.is_dep_sec_confirmed === 2 ? index : null).filter(index => index !== null);
          break;
        case 'faculty_secretary':
          pendingStudentsIndexes = studentList.map((student, index) => student.graduation_status.is_faculty_confirmed === 2 ? index : null).filter(index => index !== null);
          break;
        default:
          throw new Error('Invalid role:', currentUser?.role);
      }

      for (const index of pendingStudentsIndexes) {
        await handleUpdateGradStatus(index, 3);
      }

    } catch (error) {
      console.error('Error applying all students:', error);
    }
  }

  const handleRequestGraduationList = async () => {
    try {
      const response = await api.post(`/graduation-year/create`);
      if (response?.data?.code === "0") {
        setSnackbar({
          open: true,
          message: t("request_graduation_list_success"),
          severity: 'success'
        });
        fetchGradYearStruct();
      } else {
        setSnackbar({
          open: true,
          message: response?.data?.message,
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error requesting graduation list:', error);
      setSnackbar({
        open: true,
        message: error?.message,
        severity: 'error'
      });
    }
  }

  const handleUpdateGradStatus = async (index, status) => {
    try {
      console.log('Updating graduation status for student:', index, 'with status:', status);
      var gradStatus = { ...studentList[index] };
      switch (currentUser?.role) {
        case 'student_affairs':
          if (gradStatus.graduation_status) {
            gradStatus.graduation_status.is_std_aff_confirmed = status;
          }
          break;
        case 'advisor':
          if (gradStatus.graduation_status) {
            gradStatus.graduation_status.is_advisor_confirmed = status;
          }
          break;
        case 'department_secretary':
          if (gradStatus.graduation_status) {
            gradStatus.graduation_status.is_dep_sec_confirmed = status;
          }
          break;
        case 'faculty_secretary':
          if (gradStatus.graduation_status) {
            gradStatus.graduation_status.is_faculty_confirmed = status;
          }
          break;
        default: throw new Error('Invalid role:', currentUser?.role);
      }
      setStudentList(studentList.map((student) => student.id === gradStatus.id ? gradStatus : student));
      const response = await api.post(`/graduation-status/update`, gradStatus?.graduation_status);

      console.log('Response:', response);
    } catch (error) {
      console.error('Error updating graduation status:', error);
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCompleteGraduationProcess = async () => {
    try {
      const response = await api.post(`/graduation-year/update`, {
        ...gradYearStruct,
        end_date: new Date()
      });
      if (response?.data?.code === "0") {
        setSnackbar({
          open: true,
          message: t("graduation_process_completed"),
          severity: 'success'
        });
        gradYearStruct.end_date = new Date(new Date().getTime() - 1 * 60 * 60 * 1000);
        fetchGradYearStruct();
      }

    } catch (error) {
      console.error('Error completing graduation process:', error);
    }
  }

  {/* Student Details Modal */ }
  const ViewModal = () => {
    if (!selectedStudent) return null;

    return (
      <Modal
        open={isViewModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="student-details-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          maxHeight: '90vh',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2">
              {t("student_details")}
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }}>
              {selectedStudent.user.first_name[0]}{selectedStudent.user.last_name[0]}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {selectedStudent.user.first_name} {selectedStudent.user.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("student_id")}: {selectedStudent.user.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("email")}: {selectedStudent.user.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("telephone")}: {selectedStudent.user.telephone}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SchoolIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">{t("faculty")}</Typography>
                  <Typography variant="body2">{selectedStudent.faculty_name}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WorkIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">{t("department")}</Typography>
                  <Typography variant="body2">{selectedStudent.department_name}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SupervisorAccountIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">{t("advisor")}</Typography>
                  <Typography variant="body2">{selectedStudent.advisor.first_name} {selectedStudent.advisor.last_name}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">{t("enrollment_year")}</Typography>
                  <Typography variant="body2">{selectedStudent.student.enrollment_year}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight="bold" mb={2}>
            {t("graduation_status")}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WorkIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">{t("semester")}</Typography>
                  <Typography variant="body2">{selectedStudent.graduation_status.student_semester}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <GradeIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">{t("gpa")}</Typography>
                  <Typography variant="body2">{selectedStudent.graduation_status.student_gpa}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EventIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">{t("ects")}</Typography>
                  <Typography variant="body2">{selectedStudent.graduation_status.student_ects}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">{t("system_confirmation")}</Typography>
                  <Typography variant="body2" sx={{
                    color: selectedStudent.graduation_status.is_system_confirmed === 3 ? 'success.main' :
                           selectedStudent.graduation_status.is_system_confirmed === 2 ? 'warning.main' :
                           selectedStudent.graduation_status.is_system_confirmed === 1 ? 'error.main' : 'text.secondary'
                  }}>
                    {selectedStudent.graduation_status.is_system_confirmed === 3 ? t("approved") :
                     selectedStudent.graduation_status.is_system_confirmed === 2 ? t("pending") :
                     selectedStudent.graduation_status.is_system_confirmed === 1 ? t("rejected") : t("not_applied")}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button variant="outlined" onClick={handleCloseModal}>
              {t("close")}
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Typography variant="h4" className="text-2xl font-bold text-gray-800 mb-6">
        {t(currentUser?.role)} {t("dashboard")}
      </Typography>

      {/* Kullanıcı Profil Kartı */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main' }}
          >
            {currentUser?.first_name[0]}{currentUser?.last_name[0]}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {currentUser?.first_name} {currentUser?.last_name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {t(currentUser?.role)}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon color="primary" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">{t("email")}</Typography>
                  <Typography variant="body1">{currentUser?.email}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon color="primary" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">{t("telephone")}</Typography>
                  <Typography variant="body1">{currentUser?.telephone}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {currentUser?.role !== 'rectorate' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WorkIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">{t("department")}</Typography>
                    <Typography variant="body1">{dashboardData?.department_name}</Typography>
                  </Box>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon color="primary" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">{t("office")}</Typography>
                  <Typography variant="body1">{dashboardData?.office_location}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Request the List of Graduation-Eligible Students */}
      {currentUser?.role === 'student_affairs' && !gradYearStruct && (
        <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2, maxWidth: 500, ml: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                {t("no_graduation_list_request")} {t("year")}: {new Date().getFullYear()}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={handleRequestGraduationList}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#1565c0'
                  }
                }}
              >
                {t("request_graduation_list")}
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {gradYearStruct && new Date(gradYearStruct?.end_date) > new Date() && (
        <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2, maxWidth: 500, ml: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 2,
                  p: 1.5,
                  backgroundColor: 'rgba(0, 0, 0, 0.03)',
                  borderRadius: 1
                }}
              >
                <PendingActionsIcon color="warning" />
                <Typography variant="body2" color="text.secondary" component="div">
                  {t("graduate_lists_continue_to_be_collected")}.
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {t("last_date")}:{" "}
                      {new Date(gradYearStruct?.end_date).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </Typography>
                  </Box>
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCompleteGraduationProcess}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  backgroundColor: 'warning.main',
                  '&:hover': {
                    backgroundColor: 'warning.dark'
                  },
                  py: 1.2
                }}
                startIcon={<CheckCircleIcon />}
              >
                {t("complete_graduation_list")}
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {gradYearStruct && new Date(gradYearStruct?.end_date) < new Date() && (
        <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2, maxWidth: 500, ml: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="body1" color="text.secondary">
              {t("graduation_process_completed")}
            </Typography>
            <Chip
              icon={<CalendarTodayIcon />}
              label={`${t("year")}: ${gradYearStruct?.year}`}
              color="default"
              variant="outlined"
              size="small"
              sx={{
                px: 2,
                py: 1,
                color: 'text.secondary',
                borderColor: 'text.secondary',
                '& .MuiChip-label': {
                  px: 1
                },
                '& .MuiChip-icon': {
                  color: 'text.secondary'
                }
              }}
            />
          </Box>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/student-rank-list')}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark'
              },
              py: 1.2
            }}
          >
            {t("studentRankList")}
          </Button>
        </Paper>
      )}

      {/* Student List */}
      {(!gradYearStruct || (gradYearStruct && new Date(gradYearStruct?.end_date) > new Date())) && (
        <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                {t("my_students")}
              </Typography>
              <Chip
                label={studentList?.length}
                size="small"
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  color: 'text.primary',
                  fontWeight: 500,
                  '& .MuiChip-label': {
                    px: 1
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.12)'
                  }
                }}
              />
            </Box>
            {studentList.length > 0 && studentList.some(student => {
              if (currentUser?.role === 'advisor') {
                return student.graduation_status.is_advisor_confirmed === 2;
              } else if (currentUser?.role === 'student_affairs') {
                return student.graduation_status.is_std_aff_confirmed === 2;
              } else if (currentUser?.role === 'department_secretary') {
                return student.graduation_status.is_dep_sec_confirmed === 2;
              } else if (currentUser?.role === 'faculty_secretary') {
                return student.graduation_status.is_faculty_confirmed === 2;
              }
              return false;
            }) && (
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  startIcon={<CheckCircleIcon />}
                  onClick={handleApplyAll}
                >
                  {t("apply_all")}
                </Button>
              )}
          </Box>

          {studentList.length > 0 ? studentList?.map((student, index) => {
            var status;

            const getStatusChip = () => {
              if (currentUser?.role === 'advisor') {
                status = student.graduation_status.is_advisor_confirmed;
              } else if (currentUser?.role === 'student_affairs') {
                status = student.graduation_status.is_std_aff_confirmed;
              } else if (currentUser?.role === 'department_secretary') {
                status = student.graduation_status.is_dep_sec_confirmed;
              } else if (currentUser?.role === 'faculty_secretary') {
                status = student.graduation_status.is_faculty_confirmed;
              } else {
                throw new Error('Invalid role:', currentUser?.role);
              }

              switch (status) {
                case 3:
                  return (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label={t("applied")}
                      color="success"
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  );
                case 2:
                  return (
                    <Chip
                      icon={<PendingActionsIcon />}
                      label={t("pending")}
                      color="warning"
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  );
                case 1:
                  return (
                    <Chip
                      icon={<CancelIcon />}
                      label={t("rejected")}
                      color="error"
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  );
                default:
                  return null;
              }
            };

            return (
              <Paper
                key={student.id}
                elevation={1}
                sx={{
                  p: 1.5,
                  mb: 1.5,
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', position: 'relative' }}>
                    {student.user.first_name[0]}{student.user.last_name[0]}
                    {student?.graduation_status?.is_system_confirmed && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: -2,
                          right: -2,
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          border: '2px solid white',
                          bgcolor: student?.graduation_status?.is_system_confirmed === 3 ? 'success.main' :
                                 student?.graduation_status?.is_system_confirmed === 2 ? 'warning.main' :
                                 student?.graduation_status?.is_system_confirmed === 1 ? 'error.main' : 'grey.500'
                        }}
                      />
                    )}
                  </Avatar>

                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {student.user.first_name} {student.user.last_name}
                      </Typography>
                      {getStatusChip()}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {t("student_id")}: {student.user.username}
                    </Typography>
                    {student?.graduation_status?.is_system_confirmed && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          display: 'block',
                          fontSize: '0.7rem',
                          color: student?.graduation_status?.is_system_confirmed === 3 ? 'success.main' :
                                student?.graduation_status?.is_system_confirmed === 2 ? 'warning.main' :
                                student?.graduation_status?.is_system_confirmed === 1 ? 'error.main' : 'grey.500'
                        }}
                      >
                        {student?.graduation_status?.is_system_confirmed === 3 ? t("approved") :
                         student?.graduation_status?.is_system_confirmed === 2 ? t("pending") :
                         student?.graduation_status?.is_system_confirmed === 1 ? t("rejected") : ''}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ textAlign: 'right', minWidth: '100px' }}>
                    <Typography variant="caption" color="text.secondary">
                      {t("semester")}: {student.graduation_status.student_semester}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {t("gpa")}: {student.graduation_status.student_gpa}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {t("ects")}: {student?.graduation_status?.student_ects}
                    </Typography>
                  </Box>

                  {status === 2 && (
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title={t("view")}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleView(student, index)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("apply")}>
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleUpdateGradStatus(index, 3)}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("reject")}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleUpdateGradStatus(index, 1)}
                        >
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}

                  {status === 1 && (
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title={t("apply")}>
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleUpdateGradStatus(index, 3)}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
              </Paper>
            );
          }) : (
            <Typography variant="body1" color="text.secondary">
              {t("no_students_to_list")}
            </Typography>
          )}
        </Paper>
      )}

      <ViewModal />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}