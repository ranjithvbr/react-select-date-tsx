import Calendar from "./Calendar";

function App() {
  return (
    <div className="App">
      <Calendar  
      selectDateType="range"
      // minDate="2019-2-10"
      // maxDate="2024-9-20"
      // disableDates="past"
      // disableDates="future" 
      // defaultValue={["2021-8-15", "2021-08-1", "2021-8-4", "2021-8-7", "2021-8-25", "2021-8-30", "2021-8-17"]} 
      // defaultValue={{startDate: "2021-8-15", endDate: "2021-8-20" }}
      // defaultValue={{date: "2021-9-9"}}
      // onSelect={(date: any)=>console.log(date, "date")}
      disableDays={["sun", "sat"]} 
      // disableCertainDates={["2021-08-1", "2021-8-4", "2021-8-7", "2021-8-25", "2021-8-30", "2021-8-17"]}
      />
    </div>
  );
}

export default App;
