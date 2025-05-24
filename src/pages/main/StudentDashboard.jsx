import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid,
  Paper,
  Tooltip,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { api } from '../../api/api';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import SchoolIcon from '@mui/icons-material/School';
import GradeIcon from '@mui/icons-material/Grade';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';

function StudentDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const { t } = useTranslation();
  const [openGraduationModal, setOpenGraduationModal] = useState(false);
  const [graduationStatus, setGraduationStatus] = useState({
    id: 0,
    student_id: 0,
    student_semester: 0,
    student_gpa: 0,
    is_advisor_confirmed: 0,
    is_dep_sec_confirmed: 0,
    is_faculty_confirmed: 0,
    is_std_aff_confirmed: 0
  });
  // This will be removed in the future
  const [graduationForm, setGraduationForm] = useState({
    thesisTitle: '',
    advisor: '',
    semester: '',
    description: ''
  });

  // Örnek öğrenci bilgileri (gerçek uygulamada API'den gelecek)
  const studentInfo = {
    name: "Ahmet",
    surname: "Yılmaz",
    studentNo: "2020123456",
    department: "Bilgisayar Mühendisliği",
    status: "Aktif",
    advisor: "Prof. Dr. Mehmet Demir",
    enrollmentYear: "2020",
    expectedGraduation: "2024"
  };

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const response = await api.post(`/graduation-status/std/` + currentUser?.id);
        console.log('Response:', response);
        if (response?.data?.status?.code === "0") {
          setGraduationStatus(response?.data?.graduation_status?.[0]);
        } else if (response?.data?.code === "100") {
          console.log("Application is not applied yet");
          // setGraduationStatus(response?.data?.graduation_status?.[0]);
        } else {
          console.error('Error fetching student info:', response?.data?.status?.message);
        }
      } catch (error) {
        console.error('Error fetching student info:', error);
      }
    }
    fetchStudentInfo();
  }, [currentUser?.username]);

  const handleGraduationSubmit = async () => {
    try {
      const response = await api.post('/graduation/apply', graduationForm);
      if (response?.data?.code === "0") {
        setOpenGraduationModal(false);
        // Başarılı mesajı göster
      }
    } catch (error) {
      console.error('Error submitting graduation application:', error);
      // Hata mesajı göster
    }
  };

  return (<>
    <div className="min-h-screen bg-gray-50 p-6">
      <p className="text-2xl font-bold text-gray-800 mb-6">
        {t("student_dashboard")}
      </p>

      {/* Öğrenci Bilgileri Kartı */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          {t("student_information")}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">{t("name_surname")}</Typography>
                <Typography variant="body1">{currentUser?.first_name} {currentUser?.last_name}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">{t("student_number")}</Typography>
                <Typography variant="body1">{currentUser?.username}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">{t("department")}</Typography>
                <Typography variant="body1">{currentUser?.department}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">{t("gpa")}</Typography>
                <Typography variant="body1">{graduationStatus?.student_gpa}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">{t('advisor')}</Typography>
                <Typography variant="body1">{currentUser?.advisor}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">{t("enrollment_year")}</Typography>
                <Typography variant="body1">{currentUser?.enrollmentYear}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Graduation Status */}
      {graduationStatus?.is_system_confirmed === 0 ? (
        <>
          <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              {t("graduation_application_information")}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  {t("semester")}: {graduationStatus?.student_semester}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  {t("gpa")}: {graduationStatus?.student_gpa}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  {t("credits")}: {graduationStatus?.student_credits}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => setOpenGraduationModal(true)}
                >
                  {t("apply_for_graduation")}
                </Button>
              </Box>
            </Box>
          </Paper>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow p-4 rounded-xl">
            <h2 className="text-lg font-bold mb-2">{t("graduation_status")}</h2>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Typography variant="body2">{t("advisor_confirmation")}</Typography>
                </div>
                {graduationStatus.is_advisor_confirmed === 1 ? (
                  <Tooltip title={t("rejected")} arrow placement="top">
                    <CancelIcon color="error" />
                  </Tooltip>
                ) : graduationStatus.is_advisor_confirmed === 2 ? (
                  <Tooltip title={t("pending")} arrow placement="top">
                    <PendingIcon color="warning" />
                  </Tooltip>
                ) : graduationStatus.is_advisor_confirmed === 3 ? (
                  <Tooltip title={t("approved")} arrow placement="top">
                    <CheckCircleIcon color="success" />
                  </Tooltip>
                ) : (
                  <Tooltip title={t("pending")} arrow placement="top">
                    <PendingIcon color="warning" />
                  </Tooltip>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Typography variant="body2">{t("department_secretary_confirmation")}</Typography>
                </div>
                {graduationStatus.is_dep_sec_confirmed === 1 ? (
                  <Tooltip title={t("rejected")} arrow placement="top">
                    <CancelIcon color="error" />
                  </Tooltip>
                ) : graduationStatus.is_dep_sec_confirmed === 2 ? (
                  <Tooltip title={t("pending")} arrow placement="top">
                    <PendingIcon color="warning" />
                  </Tooltip>
                ) : graduationStatus.is_dep_sec_confirmed === 3 ? (
                  <Tooltip title={t("approved")} arrow placement="top">
                    <CheckCircleIcon color="success" />
                  </Tooltip>
                ) : (
                  <Tooltip title={t("pending")} arrow placement="top">
                    <PendingIcon color="warning" />
                  </Tooltip>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Typography variant="body2">{t("faculty_confirmation")}</Typography>
                </div>
                {graduationStatus.is_faculty_confirmed === 1 ? (
                  <Tooltip title={t("rejected")} arrow placement="top">
                    <CancelIcon color="error" />
                  </Tooltip>
                ) : graduationStatus.is_faculty_confirmed === 2 ? (
                  <Tooltip title={t("pending")} arrow placement="top">
                    <PendingIcon color="warning" />
                  </Tooltip>
                ) : graduationStatus.is_faculty_confirmed === 3 ? (
                  <Tooltip title={t("approved")} arrow placement="top">
                    <CheckCircleIcon color="success" />
                  </Tooltip>
                ) : (
                  <Tooltip title={t("pending")} arrow placement="top">
                    <PendingIcon color="warning" />
                  </Tooltip>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Typography variant="body2">{t("student_affairs_confirmation")}</Typography>
                </div>
                {graduationStatus.is_std_aff_confirmed === 1 ? (
                  <Tooltip title={t("rejected")} arrow placement="top">
                    <CancelIcon color="error" />
                  </Tooltip>
                ) : graduationStatus.is_std_aff_confirmed === 2 ? (
                  <Tooltip title={t("pending")} arrow placement="top">
                    <PendingIcon color="warning" />
                  </Tooltip>
                ) : graduationStatus.is_std_aff_confirmed === 3 ? (
                  <Tooltip title={t("approved")} arrow placement="top">
                    <CheckCircleIcon color="success" />
                  </Tooltip>
                ) : (
                  <Tooltip title={t("pending")} arrow placement="top">
                    <PendingIcon color="warning" />
                  </Tooltip>
                )}
              </div>

              <div className="mt-2 pt-2 border-t">
                <Typography variant="body2" color="text.secondary">
                  {t("semester")}: {graduationStatus.student_semester}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("gpa")}: {graduationStatus.student_gpa}
                </Typography>
              </div>
            </div>
          </div >

        </div >
      )}

      < div className="bg-white shadow p-4 rounded-xl md:col-span-1" >
        <h2 className="text-lg font-semibold mb-1">Graduation Ceremony</h2>
        <p className="text-sm text-gray-700 mb-4">Ceremony Details: [Date, Time, Location]</p>
        <div className="flex gap-3">
          <Button variant="contained" sx={{ backgroundColor: '#000000', color: '#fff' }}>Attend Ceremony</Button>
          <Button variant="outlined" color="inherit">Not Attend Ceremony</Button>
        </div>
      </div >
    </div >


    {/* Mezuniyet Başvurusu Modal */}
    < Dialog
      open={openGraduationModal}
      onClose={() => setOpenGraduationModal(false)}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          {t("graduation_application_information")}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="primary" sx={{ fontSize: 20 }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t("name_surname")}</Typography>
              <Typography variant="body2">{currentUser?.first_name} {currentUser?.last_name}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BadgeIcon color="primary" sx={{ fontSize: 20 }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t("student_number")}</Typography>
              <Typography variant="body2">{currentUser?.username}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SchoolIcon color="primary" sx={{ fontSize: 20 }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t("department")}</Typography>
              <Typography variant="body2">{studentInfo.department}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GradeIcon color="primary" sx={{ fontSize: 20 }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t("gpa")}</Typography>
              <Typography variant="body2">{studentInfo.gpa}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SupervisorAccountIcon color="primary" sx={{ fontSize: 20 }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t("advisor")}</Typography>
              <Typography variant="body2">{studentInfo.advisor}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarTodayIcon color="primary" sx={{ fontSize: 20 }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t("enrollment_year")}</Typography>
              <Typography variant="body2">{studentInfo.enrollmentYear}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventIcon color="primary" sx={{ fontSize: 20 }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t("expected_graduation")}</Typography>
              <Typography variant="body2">{studentInfo.expectedGraduation}</Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={() => setOpenGraduationModal(false)}
          sx={{ textTransform: 'none' }}
        >
          {t("close")}
        </Button>
        <Button
          variant="contained"
          onClick={handleGraduationSubmit}
          sx={{ textTransform: 'none' }}
        >
          {t("apply_for_graduation")}
        </Button>
      </DialogActions>
    </Dialog>
  </>

  );
}

export default StudentDashboard;
