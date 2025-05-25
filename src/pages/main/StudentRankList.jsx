import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Tab, 
  Tabs, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListSubheader
} from '@mui/material';
import { api } from '../../api/api';
import { useTranslation } from 'react-i18next';

const FACULTIES = {
  ENGINEERING: 'Engineering',
  SCIENCE: 'Science',
  ARCHITECTURE: 'Architecture'
};

const DEPARTMENTS = {
  // Fen Fakültesi
  PHYSICS: 'physics',
  PHOTONICS: 'photonics',
  CHEMISTRY: 'chemistry',
  MATHEMATICS: 'mathematics',
  MOLECULAR_BIOLOGY: 'molecular_biology',
  
  // Mühendislik Fakültesi
  COMPUTER_ENGINEERING: 'computer_engineering',
  BIOENGINEERING: 'bioengineering',
  ENVIRONMENTAL_ENGINEERING: 'environmental_engineering',
  ENERGY_SYSTEMS_ENGINEERING: 'energy_systems_engineering',
  ELECTRICAL_ENGINEERING: 'electrical_electronics_engineering',
  FOOD_ENGINEERING: 'food_engineering',
  CIVIL_ENGINEERING: 'civil_engineering',
  CHEMICAL_ENGINEERING: 'chemical_engineering',
  MECHANICAL_ENGINEERING: 'mechanical_engineering',
  MATERIALS_ENGINEERING: 'materials_science_and_engineering',
  
  // Mimarlık Fakültesi
  INDUSTRIAL_DESIGN: 'industrial_design',
  CONSERVATION: 'conservation',
  ARCHITECTURE: 'architecture',
  CITY_PLANNING: 'city_planning'
};

const FACULTY_DEPARTMENTS = {
  [FACULTIES.SCIENCE]: [
    DEPARTMENTS.PHYSICS,
    DEPARTMENTS.PHOTONICS,
    DEPARTMENTS.CHEMISTRY,
    DEPARTMENTS.MATHEMATICS,
    DEPARTMENTS.MOLECULAR_BIOLOGY
  ],
  [FACULTIES.ENGINEERING]: [
    DEPARTMENTS.COMPUTER_ENGINEERING,
    DEPARTMENTS.BIOENGINEERING,
    DEPARTMENTS.ENVIRONMENTAL_ENGINEERING,
    DEPARTMENTS.ENERGY_SYSTEMS_ENGINEERING,
    DEPARTMENTS.ELECTRICAL_ENGINEERING,
    DEPARTMENTS.FOOD_ENGINEERING,
    DEPARTMENTS.CIVIL_ENGINEERING,
    DEPARTMENTS.CHEMICAL_ENGINEERING,
    DEPARTMENTS.MECHANICAL_ENGINEERING,
    DEPARTMENTS.MATERIALS_ENGINEERING
  ],
  [FACULTIES.ARCHITECTURE]: [
    DEPARTMENTS.INDUSTRIAL_DESIGN,
    DEPARTMENTS.CONSERVATION,
    DEPARTMENTS.ARCHITECTURE,
    DEPARTMENTS.CITY_PLANNING
  ]
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function StudentRankList() {
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const [allStudents, setAllStudents] = useState([]);
  const [allStudentsList, setAllStudentsList] = useState([]);
  const [topThreeFacultyStudents, setTopThreeFacultyStudents] = useState([]);
  const [topThreeDepartmentStudents, setTopThreeDepartmentStudents] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const response = await api.post('/students/all/top3');
        setAllStudents(response.data);
      } catch (error) {
        console.error('Öğrenci verileri alınamadı:', error);
      }
    };
    fetchAllStudents();
  }, []);

  useEffect(() => {
    const fetchAllStudentsList = async () => {
      try {
        const response = await api.post('/students/all/ranked');
        console.log('All students list response:', response);
        setAllStudentsList(response.data);
      } catch (error) {
        console.error('Tüm öğrenci verileri alınamadı:', error);
      }
    };
    fetchAllStudentsList();
  }, []);

  useEffect(() => {
    const fetchTopThreeFacultyStudents = async () => {
      if (!selectedFaculty) return;
      
      try {
        const response = await api.post(`/students/faculty/${selectedFaculty}/top3`);
        setTopThreeFacultyStudents(response.data);
      } catch (error) {
        console.error('Error fetching top 3 faculty students:', error);
      }
    };
    fetchTopThreeFacultyStudents();
  }, [selectedFaculty]);

  useEffect(() => {
    const fetchTopThreeDepartmentStudents = async () => {
      if (!selectedDepartment) return;
      
      try {
        const response = await api.post(`/students/department/${selectedDepartment}/top3`);
        setTopThreeDepartmentStudents(response.data);
      } catch (error) {
        console.error('Error fetching top 3 department students:', error);
      }
    };
    fetchTopThreeDepartmentStudents();
  }, [selectedDepartment]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFacultyChange = (event) => {
    setSelectedFaculty(event.target.value);
    setSelectedDepartment(''); // Fakülte değiştiğinde departman seçimini sıfırla
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const StudentTable = ({ students }) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("rank")}</TableCell>
            <TableCell>{t("name")}</TableCell>
            <TableCell>{t("department")}</TableCell>
            <TableCell>{t("faculty")}</TableCell>
            <TableCell>{t("gpa")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students && students?.length > 0 && students?.map((student, index) => (
            <TableRow key={student.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{student?.user?.first_name} {student?.user?.last_name}</TableCell>
              <TableCell>{student?.department_name}</TableCell>
              <TableCell>{student?.faculty_name}</TableCell>
              <TableCell>{student?.graduation_status?.student_gpa}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderDepartmentOptions = () => {
    return Object.entries(FACULTY_DEPARTMENTS).map(([faculty, departments]) => [
      <ListSubheader 
        key={faculty} 
        sx={{ 
          backgroundColor: 'primary.light', 
          color: 'white',
          lineHeight: '32px',
          padding: '0 16px',
          fontSize: '0.875rem'
        }}
      >
        {t(faculty)}
      </ListSubheader>,
      ...departments.map(department => (
        <MenuItem 
          key={department} 
          value={department} 
          sx={{ 
            pl: 4,
            minHeight: '32px',
            fontSize: '0.875rem'
          }}
        >
          {t(department)}
        </MenuItem>
      ))
    ]);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t("studentRankList")}
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="student rank tabs">
          <Tab label={t("all_students")} />
          <Tab label={t("all_students_top_3")} />
          <Tab label={t("faculty_top_3")} />
          <Tab label={t("department_top_3")} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <StudentTable students={allStudentsList} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <StudentTable students={allStudents} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="faculty-select-label">{t("select_faculty")}</InputLabel>
            <Select
              labelId="faculty-select-label"
              id="faculty-select"
              value={selectedFaculty}
              label={t("select_faculty")}
              onChange={handleFacultyChange}
            >
              {Object.values(FACULTIES).map((faculty) => (
                <MenuItem key={faculty} value={faculty}>
                  {t(faculty)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <StudentTable students={topThreeFacultyStudents} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="department-select-label">{t("select_department")}</InputLabel>
            <Select
              labelId="department-select-label"
              id="department-select"
              value={selectedDepartment}
              label={t("select_department")}
              onChange={handleDepartmentChange}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300
                  }
                },
                sx: {
                  '& .MuiMenuItem-root': {
                    minHeight: '32px'
                  }
                }
              }}
            >
              {renderDepartmentOptions()}
            </Select>
          </FormControl>
        </Box>
        <StudentTable students={topThreeDepartmentStudents} />
      </TabPanel>
    </Container>
  );
}