import React, { useRef } from 'react';
import "./styles.css";
import solarisData from './Solaris-2.json';
import { Tooltip, Pie, PieChart, Cell } from 'recharts';
import { DatePickerComponent } from './DatePickerComponent';
import { StatusLineChartComponent } from './StatusLineChartComponent';
import { BarChartComponent } from './BarChartComponent';
import { SelectComponent } from './SelectComponent';
import { MainProvider } from './AppContext';
import { Button, IconButton } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import CloseIcon from '@mui/icons-material/Close';
import { Tooltip as CheckBoxTooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

interface creature {
  status: string;
  age: string;
  diet: string;
  taxonomy: string[];
  id: string;
}

interface creaturesWithDate {
  date: Date;
  creatures: creature[];
}

export const App: React.FC = props => {
  const solaris: any = JSON.parse(JSON.stringify(solarisData));
  const minDate = useRef(new Date(Date.parse(solaris[0][0])));
  const maxDate = useRef(new Date(Date.parse(solaris[solaris.length - 1][0])));
  const [displayClicked, setDisplayClicked] = React.useState(false);
  const [dateSelected, setDateSelected] = React.useState(false);
  // To filter creatures according to the selected attributes. 
  const itemSelections = useRef(new Map()).current;
  React.useEffect(() => {
    itemSelections.set("Age", "").set("Status", "").set("Diet", "").set("Date", "");
  }, [])

  /**
   * Creates a status object array which has (status, count) pairs for each status (alive, dead, unknown).
   * 
   * @returns a status object array.
   */
  const createStatusDataForOneDay = (creatures: creature[]) => {
    const statusDataMap = new Map();
    statusDataMap.set("alive", 0)
      .set("dead", 0).set("unknown", 0);

    creatures.forEach((data: { status: any; }) => {
      const status = data.status;
      const statusCount = statusDataMap.get(status);
      statusDataMap.set(status, statusCount + 1);
    })
    let data: any[] = []
    statusDataMap.forEach((key: string, value: number) => {
      data.push({ name: value, count: key });
    })
    return data;
  };

  const createStatusDataForAllDays = () => {
    let data: any[] = [];
    solaris.forEach((value: any[]) => {
      let date: string = new Date(Date.parse(value[0])).toLocaleDateString();
      let statusData: any[] = createStatusDataForOneDay(value[1]);
      let alive: string = statusData[0].name;
      let aliveCount: number = statusData[0].count;
      let unknown: string = statusData[1].name;
      let unknownCount: number = statusData[1].count;
      let dead: string = statusData[2].name;
      let deadCount: number = statusData[2].count;
      data.push({ name: date, [alive]: aliveCount, [unknown]: unknownCount, [dead]: deadCount })
    });
    return data;
  };

  // Calculate only once on first render.
  const statusDataForAllDays = React.useMemo(createStatusDataForAllDays, []);

  const findCreatureFamilies = () => {
    let families: String[] = [];
    solaris[0][1].forEach((value: any) => {
      let taxonomy = value.taxonomy;
      let family = taxonomy[0];
      if (!families.includes(family)) {
        families.push(family);
      }
    })
    return families;
  };

  const handleSelectConditions = (value: creature, age: string, status: string, diet: string) => {
    if (age === "" && status === "" && diet === "")
      return true;
    else if (age === "" && status === "" && value.diet === diet)
      return value.diet === diet;
    else if (age === "" && value.status === status && diet === "")
      return value.status === status;
    else if (age === "" && value.status === status && value.diet === diet)
      return value.status === status && value.diet === diet;
    else if (value.age === age && status === "" && diet === "")
      return value.age === age;
    else if (value.age === age && status === "" && value.diet === diet)
      return value.age === age && value.diet === diet;
    else if (value.age === age && value.status === status && diet === "")
      return value.age === age && value.status === status;
    else
      return value.age === age && value.status === status && value.diet === diet;
  };

  /**
 * Filters creatures according to the selected filters for one day.
 * 
 * @param creatures 
 * @returns 
 */
  const filterCreaturesForOneDay = (creatures: creature[]) => {
    const age: string = itemSelections.get("Age");
    const status: string = itemSelections.get("Status");
    const diet: string = itemSelections.get("Diet");

    let result = creatures.filter((value: creature) => {
      return handleSelectConditions(value, age, status, diet);
    });
    return result;
  };

  const createFamilyDataForOneDay = (creatures: creature[]) => {
    const families: String[] = findCreatureFamilies();
    const familyDataMap = new Map();
    families.forEach(value => {
      familyDataMap.set(value, 0);
    });
    creatures = filterCreaturesForOneDay(creatures);
    creatures.forEach(value => {
      const family: string = value.taxonomy[0];
      const familyCount: number = familyDataMap.get(family);
      familyDataMap.set(family, familyCount + 1);
    });
    let data: any[] = []
    familyDataMap.forEach((key: string, value: number) => {
      data.push({ name: value, count: key });
    });
    return data;
  };

  const createFamilyDataForAllDays = () => {
    let data: any[] = [];
    solaris.forEach((value: any[]) => {
      const date: string = new Date(Date.parse(value[0])).toLocaleDateString();
      const familyData: any[] = createFamilyDataForOneDay(value[1]);
      const firstFamilyName: string = familyData[0].name;
      const firstFamilyCount: number = familyData[0].count;
      const secondFamilyName: string = familyData[1].name;
      const secondFamilyCount: number = familyData[1].count;
      const thirdFamilyName: string = familyData[2].name;
      const thirdFamilyCount: number = familyData[2].count;
      data.push({ name: date, [firstFamilyName]: firstFamilyCount, [secondFamilyName]: secondFamilyCount, [thirdFamilyName]: thirdFamilyCount })
    });
    return data;
  };

  const filterCreaturesForSelectedDate = () => {
    const date: string = itemSelections.get("Date");

    let filteredData = solaris.filter((value: any) => {
      const parsedDate: string = new Date(Date.parse(value[0])).toLocaleDateString();
      return parsedDate === date;
    })
    let creaturesToFilter: [] = filteredData.length == 0 ? [] : filteredData[0][1];
    let result = filterCreaturesForOneDay(creaturesToFilter);

    return result;
  };

  // useMemo?
  const filteredCreaturesForSelectedDate = filterCreaturesForSelectedDate();
  const familyDataForOneDay = createFamilyDataForOneDay(filteredCreaturesForSelectedDate);
  const familyDataForAllDays = createFamilyDataForAllDays();

  const createPieChart = () => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
    return (
      <PieChart width={800} height={700}>
        <Pie data={familyDataForOneDay} dataKey="count" outerRadius={250} fill="green" >
          {familyDataForOneDay.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    );
  }

  const createCheckboxButton = () => {
    return (
      <div style={{ marginLeft: "30px", display: "flex", flexDirection: "row" }}>
        <CheckBoxTooltip title="To create a pie chart for a single day, you can select a date by enabling checkbox below.
          If you don't select a date, a bar chart will be displayed for each day.">
          <IconButton>
            <InfoIcon sx={{ color: "#134ed3" }} />
          </IconButton>
        </CheckBoxTooltip>
        <Checkbox
          checked={dateSelected}
          onChange={() => {
            setDateSelected(!dateSelected);
          }}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </div>
    );
  };

  return (
    <div className="App">
      <MainProvider value={itemSelections}>
        <h1>Solaris</h1>
        <StatusLineChartComponent data={statusDataForAllDays} />
        <div style={{ display: "flex", flexDirection: "column", border: "solid 1px black", paddingBottom: "10px" }}>
          <u style={{ marginBottom: "10px", marginTop: "10px", fontSize: "16px" }}>  RESULT </u>
          <div className={"filter-date-container"}>
            <div className={"selection-container"}>
              <SelectComponent label='Age' selectItem1='Young' selectItem2='Adult' />
              <SelectComponent label='Status' selectItem1='Alive' selectItem2='Dead' selectItem3='Unknown' />
              <SelectComponent label='Diet' selectItem1='Carnivore' selectItem2='Herbivore' />
              {createCheckboxButton()}
              {dateSelected ? <DatePickerComponent minDate={minDate.current} maxDate={maxDate.current} /> : null}
            </div>
            <div style={{ marginTop: "10px", marginRight: "20px" }}>
              {displayClicked ? dateSelected ? createPieChart() : <BarChartComponent data={familyDataForAllDays} /> : null}
            </div>
            {displayClicked ?
              <Button sx={{ width: 10, height: 20 }} variant="outlined" size="small" onClick={() => setDisplayClicked(false)} >
                <CloseIcon />
              </Button>
              : null}
          </div>
        </div>
        <Button variant="contained" size="small" onClick={() => setDisplayClicked(true)}> Display filter result </Button>
      </MainProvider>
    </div>
  );
};