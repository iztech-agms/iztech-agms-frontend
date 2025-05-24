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
import { api } from '../../api/api';

export default function UserDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const { t } = useTranslation();
  const [studentList, setStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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

    fetchStudentList();
  }, []);

  const handleView = (student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedStudent(null);
  };

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
        case 'faculty':
          if (gradStatus.graduation_status) {
            gradStatus.graduation_status.is_faculty_confirmed = status;
          }
          break;
        default: throw new Error('Invalid role:', currentUser?.role);
      }
      console.log('Grad status:', gradStatus);

      setStudentList(studentList.map((student) => student.id === gradStatus.id ? gradStatus : student));
      const response = await api.post(`/graduation-status/update`, gradStatus?.graduation_status);

      console.log('Response:', response);
    } catch (error) {
      console.error('Error updating graduation status:', error);
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
          width: 400,
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
            </Box>
          </Box>



          {/* Student Details */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WorkIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {t("semester")}: {selectedStudent.graduation_status.student_semester}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WorkIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {t("gpa")}: {selectedStudent.graduation_status.student_gpa}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WorkIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {t("credits")}: {selectedStudent.graduation_status.student_credits}
                </Typography>
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkIcon color="primary" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">{t("department")}</Typography>
                  <Typography variant="body1">{currentUser?.department}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon color="primary" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">{t("office")}</Typography>
                  <Typography variant="body1">{currentUser?.office}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Student List */}
      <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          {t("my_students")}
        </Typography>

        {studentList.map((student, index) => {
          var status;

          const getStatusChip = () => {
            if (currentUser?.role === 'advisor') {
              status = student.graduation_status.is_advisor_confirmed;
            } else if (currentUser?.role === 'student_affairs') {
              status = student.graduation_status.is_std_aff_confirmed;
            } else if (currentUser?.role === 'department_secretary') {
              status = student.graduation_status.is_dep_sec_confirmed;
            } else if (currentUser?.role === 'faculty') {
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

            return null;
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
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  {student.user.first_name[0]}{student.user.last_name[0]}
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
                </Box>

                <Box sx={{ textAlign: 'right', minWidth: '100px' }}>
                  <Typography variant="caption" color="text.secondary">
                    {t("semester")}: {student.graduation_status.student_semester}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {t("gpa")}: {student.graduation_status.student_gpa}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {t("credits")}: {student.graduation_status.student_credits}
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
              </Box>
            </Paper>
          );
        })}
      </Paper>

      <ViewModal />

      {/* 
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              {t("my_courses")}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {t("view_and_manage_courses")}
            </Typography>
            <Button variant="contained" fullWidth>
              {t("view_courses")}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              {t("my_students")}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {t("view_and_manage_students")}
            </Typography>
            <Button variant="contained" fullWidth>
              {t("view_students")}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              {t("announcements")}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {t("view_latest_announcements")}
            </Typography>
            <Button variant="contained" fullWidth>
              {t("view_announcements")}
            </Button>
          </Paper>
        </Grid> 
      </Grid>
        */}
    </div>
  );
}