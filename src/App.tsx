import Calendar from "./Calendar";

function App() {
  const singleSlotDates = [
    { date: "2021-07-03", avaliableSlot: 7 },
    { date: "2021-07-05", avaliableSlot: 1 },
    { date: "2021-07-15", avaliableSlot: 7 },
    { date: "2021-07-07", avaliableSlot: 10 },
    { date: "2021-07-01", avaliableSlot: 8 },
    { date: "2021-07-04", avaliableSlot: 10 },
    { date: "2021-07-10", avaliableSlot: 5 },
    { date: "2021-07-13", avaliableSlot: 4 },
    { date: "2021-07-14", avaliableSlot: 22 },
    { date: "2021-07-17", avaliableSlot: 50 },
    { date: "2021-07-20", avaliableSlot: 44 },
    { date: "2021-07-22", avaliableSlot: 9 },
    { date: "2021-07-24", avaliableSlot: 66 },
    { date: "2021-07-25", avaliableSlot: 3 },
    { date: "2021-07-28", avaliableSlot: 32 },
  ];
  return (
    <div className="App">
      <Calendar  
      selectDateType="range"
      // minDate="2021-9-01"
      // maxDate="2021-9-20"
      // disableDates="past"
      // disableDates="future" 
      // defaultValue={["2021-8-15", "2021-08-1", "2021-8-4", "2021-8-7", "2021-8-25", "2021-8-30", "2021-8-17"]} 
      // defaultValue={{startDate: "2021-8-15", endDate: "2021-8-20" }}
      // defaultValue={{date: "2021-9-9"}}
      // onSelect={(date: any)=>console.log(date, "date")}
      // disableDays={["sun", "sat"]} 
      // disableCertainDates={["2021-08-1", "2021-8-4", "2021-8-7", "2021-8-25", "2021-8-30", "2021-8-17"]}
      // singleSlotDates={[{}]}
      // duelSlotDates={[{}]}
      // templateClr="blue"
      />
    </div>
  );
}

export default App;
