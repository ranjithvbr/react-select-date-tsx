    // if (propsMinDate) {
    //   setminAndmaxDate({
    //     minDate: formatDay(new Date(propsMinDate)),
    //     maxDate: minAndmaxDate.maxDate,
    //   });
    // }
    // if (propsMaxDate) {
    //   setminAndmaxDate({
    //     minDate: minAndmaxDate.minDate,
    //     maxDate: formatDay(new Date(propsMaxDate)),
    //   });
    // }



    // const slotClass =
    // slotsState &&
    // (selectType === "range"
    //   ? singleSlots.length > 0
    //     ? "cld_cellAvailableMg"
    //     : "cld_cellHoverMg"
    //   : "cld_cellHoverMgbt");

    // same

    // const slotClass = slotsState && (selectType === "range" ? (singleSlots.length > 0 ? "cld_cellAvailableMg" : "cld_cellHoverMg") : "cld_cellHoverMgbt");


    // calendar container

    // duelSlots.length > 0 ? "cld_slotWidth" : singleSlots.length > 0 ? "cld_avlSlotWidth" : "cld_noslotWidth"


    // disable state

    // (disableState &&
    //     !(minDate && disableDates === "past") &&
    //     !(maxDate && disableDates === "future") &&
    //     getDisableDate(new Date(dateTypeId), disableState)) ||
    //   (minDate &&
    //     setMinDate(
    //       minDate && disableDates === "past" && new Date(minDate) < new Date() ? new Date() : new Date(minDate),
    //       new Date(dateTypeId),
    //     )) ||
    //   (maxDate &&
    //     setMaxDate(
    //       maxDate && disableDates === "future" && new Date(maxDate) > new Date() ? new Date() : new Date(maxDate),
    //       new Date(dateTypeId),
    //     ));


            // disableDate
            // let disableDate;
            // if(disableState &&
            //   !(minDate && disableDates === "past") &&
            //   !(maxDate && disableDates === "future") ){
            //     disableDate = getDisableDate(new Date(dateTypeId), disableState);
            //   }else if(minDate){
            //     disableDate = setMinDate(
            //       minDate && disableDates === "past" && new Date(minDate) < new Date() ? new Date() : new Date(minDate),
            //       new Date(dateTypeId),
            //     )
            //   }else if(maxDate){
            //     disableDate = setMaxDate(
            //       maxDate && disableDates === "future" && new Date(maxDate) > new Date() ? new Date() : new Date(maxDate),
            //       new Date(dateTypeId),
            //     )
            //   }


            import * as React from "react";
import { useEffect, useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import CldDateField from "../Fields/cldDateField";
import {
  getDisableDate,
  getDisableDateForArrow,
  getDisableYear,
  getDisableCertainDate,
  getDisableWhenRange,
  formatDay,
  setCurrentTime,
  addZero,
  setMinDate,
  setMaxDate,
} from "../cldDisable";
import { disableLeftArrow, disableRightArrow, getDisableDays } from "./disableArrow";
import { SelectMonthField, SelectYearField } from "../Fields/cldSelectField";
import { dateRange, getDaysInMonth } from "./dateRange";
import "./calendar.css";
import Legends from "../Legends/legends";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * @param {*} props all the props needed for customize the calendar
 * @returns {React.ReactElement} returns a calendar with single, multiple and range with slots options
 */
function Calendar({
  selectDateType,
  disableDates,
  disableCertainDates,
  duelSlotDates,
  singleSlotDates,
  onSelect,
  slotInfo = true,
  showDateInputField = true,
  showArrow = true,
  showSelectMonthArrow,
  showSelectYearArrow,
  showDatelabel,
  templateClr,
  minDate,
  maxDate,
  defaultValue,
  disableDays,
}) {
  const currentdate = useMemo(() => {
    if (minDate && new Date(minDate) > new Date()) {
      return new Date(minDate);
    }
    if (minDate && maxDate && new Date(minDate) < new Date() && new Date(maxDate) < new Date()) {
      return new Date(minDate);
    }
    if (maxDate && new Date(maxDate) < new Date()) {
      return new Date(new Date(maxDate));
    }
    return new Date();
  }, [minDate, maxDate]);
  const findDaysInMonth = new Date(currentdate.getFullYear(), currentdate.getMonth() + 1, 0).getDate();
  const findStartDayInMonth = new Date(currentdate.getFullYear(), currentdate.getMonth(), 1).getDay();
  const disableState = disableDates || "";

  const selectType = useMemo(() => {
    return selectDateType || "single";
  }, [selectDateType]);

  const disableCertainDate = useMemo(() => {
    return disableCertainDates || [];
  }, [disableCertainDates]);

  const singleSlots = useMemo(() => {
    return singleSlotDates || [];
  }, [singleSlotDates]);

  const duelSlots = useMemo(() => {
    return duelSlotDates || [];
  }, [duelSlotDates]);

  const [getDate, setGetDate] = useState(findDaysInMonth);
  const [getStartDay, setGetStartDay] = useState(findStartDayInMonth);
  const [calenderDates, setCalenderDates] = useState();
  const [dynMonth, setDynMonth] = useState(currentdate.getMonth() + 1);
  const [dynYear, setDynYear] = useState(currentdate.getFullYear());
  const [baseId, setBaseId] = useState([]);
  const [rangeId, setRangeId] = useState([]);
  const [inRange, setInRange] = useState();
  const [slotsDate, setSlotsDate] = useState([]);
  const [disableArrow, setDisableArrow] = useState();
  const [daysInMonth, setDaysInMonth] = useState();
  const [startDate, setStartDate] = useState("");
  const [multipleDate, setMultipleDate] = useState([]);
  const [startAndendDate, setStartAndendDate] = useState({
    startDate: "",
    endDate: "",
  });
  const [startAndendYearOptions, setstartAndendYearOptions] = useState({
    startYearOption: 1921,
    endYearOption: 2100,
  });

  const handleDisableArrow = useCallback(() => {
    setDisableArrow(getDisableDateForArrow(disableState, dynMonth, dynYear));
    if (disableDays?.length > 0) {
      setDaysInMonth(getDaysInMonth(dynMonth - 1, dynYear));
    }
  }, [disableDays.length, disableState, dynMonth, dynYear]);

  useEffect(() => {
    handleDisableArrow();
  }, [handleDisableArrow]);

  useEffect(() => {
    if (disableState === "past" || disableState === "future" || minDate || maxDate) {
      setstartAndendYearOptions(getDisableYear(disableState, minDate, maxDate));
    }
  }, [disableState, minDate, maxDate]);

  useEffect(() => {
    const slotDateArr = [];
    const slotState = (singleSlots.length > 0 && singleSlots) || (duelSlots.length > 0 && duelSlots) || [];
    slotState.forEach((slDt) => {
      slotDateArr.push(formatDay(new Date(slDt.date)));
    });
    setSlotsDate(slotDateArr);
  }, [duelSlots, singleSlots]);

  useEffect(() => {
    if (selectDateType === "range" && defaultValue && defaultValue.startDate && defaultValue.endDate) {
      const defaultRange = dateRange(new Date(defaultValue.startDate), new Date(defaultValue.endDate));
      const defaultAllRangeDate = defaultRange.map(
        (date) => `${addZero(date.getDate())}${addZero(date.getMonth() + 1)}${date.getFullYear()}`,
      );
      setRangeId(defaultAllRangeDate);
      setStartAndendDate({
        startDate: setCurrentTime(new Date(defaultValue.startDate)),
        endDate: setCurrentTime(new Date(defaultValue.endDate)),
      });
      return;
    }

    if (selectDateType === "single" && defaultValue && defaultValue.date) {
      const singleDefaultDate = new Date(defaultValue.date);
      const singleDefaultId = `${addZero(singleDefaultDate.getDate())}${addZero(
        singleDefaultDate.getMonth() + 1,
      )}${singleDefaultDate.getFullYear()}`;
      setStartDate(singleDefaultDate);
      setBaseId([singleDefaultId]);
      return;
    }

    if (selectDateType === "multiple" && defaultValue && defaultValue.length > 0) {
      const setDefaultDate = [];
      const getInitailActualDate = [];
      defaultValue?.forEach((initialDate) => {
        const initialNewDate = new Date(initialDate);
        setDefaultDate.push(
          `${addZero(initialNewDate.getDate())}${addZero(
            initialNewDate.getMonth() + 1,
          )}${initialNewDate.getFullYear()}`,
        );
        getInitailActualDate.push(initialNewDate);
      });
      const multipleDefaultDate = setDefaultDate;
      setMultipleDate(getInitailActualDate);
      setBaseId(multipleDefaultDate);
    }
  }, [defaultValue, selectDateType]);

  const rangeCalculater = useCallback(
    (id) => {
      const idDate = new Date(id);
      if (rangeId.length === 0) {
        const convertID = `${addZero(idDate.getDate())}${addZero(idDate.getMonth() + 1)}${idDate.getFullYear()}`;
        setRangeId([convertID]);
        setStartAndendDate((prevState) => ({
          ...prevState,
          startDate: setCurrentTime(idDate),
        }));
        setInRange(null);
      } else if (rangeId.length === 1 && formatDay(idDate) !== formatDay(startAndendDate.startDate)) {
        let getStartDate;
        let getEndDate;
        const findGreater = new Date(startAndendDate.startDate) < idDate;
        if (findGreater) {
          getStartDate = startAndendDate.startDate;
          getEndDate = idDate;
        } else {
          getStartDate = idDate;
          getEndDate = startAndendDate.startDate;
        }
        const range = dateRange(new Date(getStartDate), new Date(getEndDate));
        const allRangeDate = range.map(
          (date) => `${addZero(date.getDate())}${addZero(date.getMonth() + 1)}${date.getFullYear()}`,
        );

        setRangeId(allRangeDate);
        setInRange(null);
        if (findGreater) {
          setStartAndendDate({
            startDate: startAndendDate.startDate,
            endDate: setCurrentTime(idDate),
          });
        } else {
          setStartAndendDate({
            startDate: setCurrentTime(idDate),
            endDate: startAndendDate.startDate,
          });
        }
      } else {
        const convertID = `${addZero(idDate.getDate())}${addZero(idDate.getMonth() + 1)}${idDate.getFullYear()}`;
        setRangeId([convertID]);
        setStartAndendDate({
          startDate: setCurrentTime(idDate),
        });
      }
    },
    [rangeId, startAndendDate],
  );

  useEffect(() => {
    if (selectType === "multiple") {
      onSelect && onSelect(multipleDate);
    } else if (selectType === "range") {
      onSelect && onSelect(startAndendDate);
    } else {
      onSelect && onSelect(startDate);
    }
  }, [startDate, multipleDate, startAndendDate, onSelect, selectType]);

  const highLight = useCallback(
    (id, actualDateId) => {
      switch (selectType) {
        case "single":
          setBaseId([id]);
          setStartDate(setCurrentTime(actualDateId));
          break;
        case "multiple":
          if (!baseId.includes(id)) {
            setBaseId((oldArray) => [...oldArray, id]);
            setMultipleDate((oldArray) => [...oldArray, setCurrentTime(actualDateId)]);
          } else {
            const findedId = baseId.findIndex((li) => li === id);
            const removedSelect = baseId.filter((_i, index) => findedId !== index);
            const removedActualDateId = multipleDate.filter((_i, index) => findedId !== index);
            setBaseId(removedSelect);
            setMultipleDate(removedActualDateId);
          }
          break;
        case "range":
          rangeCalculater(id);
          break;
        default:
      }
    },
    [baseId, multipleDate, rangeCalculater, selectType],
  );
  /**
   * @param {object} event mouseHover data-info
   */
  const handleMouseEnter = (event) => {
    setInRange(event.target.dataset.info);
  };

  const handleRenderDate = useCallback(() => {
    const noOfDate = [];
    let templateHighLightbg;
    let templateRangeHighLightbg;
    let templateBorder;
    let templateCurrentDay;
    if (templateClr === "blue") {
      templateHighLightbg = "cld_blueHighlight";
      templateRangeHighLightbg = "cld_inrangeBlue cld_inrangeIndexBlue";
      templateBorder = "cld_cellBlueActive";
      templateCurrentDay = "cld_currentDayBlue";
    } else {
      templateHighLightbg = "cld_greenHighlight";
      templateRangeHighLightbg = "cld_inrangeGreen cld_inrangeIndexGreen";
      templateBorder = "cld_cellGreenActive";
      templateCurrentDay = "cld_currentDayGreen";
    }

    for (let i = 1; i <= getDate + getStartDay; i += 1) {
      if (i <= getStartDay) {
        noOfDate.push(<td />);
      } else {
        const dateId = `${addZero(i - getStartDay)}${addZero(dynMonth)}${dynYear}`;
        const dateTypeId = `${dynYear}-${addZero(dynMonth)}-${addZero(i - getStartDay)}`;

        // range classname for start,between and end
        let rangeHightLight;
        if (rangeId[0] === dateId) {
          rangeHightLight = `${templateHighLightbg} cld_highlightFirstNum`;
        } else if (rangeId[rangeId.length - 1] === dateId) {
          rangeHightLight = `${templateHighLightbg} cld_highlightLastNum`;
        } else if (rangeId.includes(dateId)) {
          rangeHightLight = `${templateHighLightbg} cld_highlightNum`;
        }
        // firstOrder change className
        const rangeStartDate = startAndendDate.startDate && startAndendDate.startDate;
        const rangeEndDate = startAndendDate.endDate && startAndendDate.endDate;
        if (rangeId.length === 1 && inRange && rangeStartDate.getDate() > Number(inRange)) {
          rangeHightLight = rangeId[0] === dateId && `${templateHighLightbg} cld_highlightLastNum`;
        }
        // classname for range, single and multiple
        let highLightNum;
        if (selectType === "range") {
          highLightNum = rangeHightLight;
        } else if (baseId.includes(dateId)) {
          highLightNum = `${templateHighLightbg} cld_highlightNumCircle`;
        }
        // startDate and endDate between ranges
        let inRangeCondition;
        if (rangeId.length === 1 && inRange) {
          if (dynYear === rangeStartDate.getFullYear() && dynMonth === rangeStartDate.getMonth() + 1) {
            inRangeCondition =
              (Number(inRange) >= i - getStartDay &&
                rangeStartDate.getDate() < i - getStartDay &&
                `${templateRangeHighLightbg} cld_inrangeLastIndex`) ||
              (Number(inRange) <= i - getStartDay &&
                rangeStartDate.getDate() > i - getStartDay &&
                `${templateRangeHighLightbg} cld_inrangeFirstIndex`);
          } else if (rangeStartDate < new Date(`${dynYear}-${dynMonth}-${Number(inRange)}`)) {
            inRangeCondition = Number(inRange) >= i - getStartDay && `${templateRangeHighLightbg} cld_inrangeLastIndex`;
          } else {
            inRangeCondition =
              Number(inRange) <= i - getStartDay && `${templateRangeHighLightbg} cld_inrangeFirstIndex`;
          }
        }
        // disableDate
        const disableDate =
          (disableState &&
            !(minDate && disableDates === "past") &&
            !(maxDate && disableDates === "future") &&
            getDisableDate(new Date(dateTypeId), disableState)) ||
          (minDate &&
            setMinDate(
              minDate && disableDates === "past" && new Date(minDate) < new Date() ? new Date() : new Date(minDate),
              new Date(dateTypeId),
            )) ||
          (maxDate &&
            setMaxDate(
              maxDate && disableDates === "future" && new Date(maxDate) > new Date() ? new Date() : new Date(maxDate),
              new Date(dateTypeId),
            ));

        const showDisableWhenRange =
          rangeId.length > 1 &&
          (disableCertainDate.length > 0 || disableDays.length > 0) &&
          getDisableWhenRange(
            disableCertainDate,
            disableDays,
            new Date(dateTypeId),
            rangeStartDate,
            rangeEndDate,
            daysInMonth,
          );

        const disableSpecificDate =
          disableCertainDate.length > 0 && getDisableCertainDate(new Date(dateTypeId), disableCertainDate);

        // disableDay
        const disableDayState = disableDays.length > 0 && getDisableDays(disableDays, dateTypeId);

        // dualSlots || singleSlots
        const slotsState = duelSlots.length > 0 || singleSlots.length > 0;

        let slotClass;
        if (slotsState) {
          if (selectType === "range") {
            if (singleSlots.length > 0) {
              slotClass = "cld_cellAvailableMg";
            } else {
              slotClass = "cld_cellHoverMg";
            }
          } else {
            slotClass = "cld_cellHoverMgbt";
          }
        }

        let disableDateRangeClass;
        if (disableDate) {
          disableDateRangeClass = disableDate;
        } else if (disableSpecificDate) {
          disableDateRangeClass = disableSpecificDate;
        } else if (disableDayState) {
          disableDateRangeClass = disableDayState;
        } else {
          disableDateRangeClass = `${highLightNum} ${
            selectType !== "range" && !slotsState && "cld_cellSingleMultiple"
          } ${rangeId.length !== 1 && `${templateBorder} cld_cellActive`} ${inRangeCondition}`;
        }
        // slot
        const slotIndex =
          slotsState && duelSlots.length > 0
            ? duelSlots[slotsDate.indexOf(formatDay(new Date(dateTypeId)))]
            : singleSlots[slotsDate.indexOf(formatDay(new Date(dateTypeId)))];

        // currentDay
        const currentDayClass =
          formatDay(new Date(dateTypeId)) === formatDay(new Date()) && `${templateCurrentDay} cld_currentDay`;
        // merge all classname
        const tdClass = `${slotClass} ${showDisableWhenRange} ${currentDayClass} ${disableDateRangeClass} cld_cellHover`;
        // remove false and undefined in classname
        const tdStyles = tdClass.trim().split("false ").join("").split("undefined ").join("");

        noOfDate.push(
          <td
            onMouseEnter={
              (!disableDate || !disableSpecificDate || !disableDayState) && rangeId.length === 1
                ? handleMouseEnter
                : undefined
            }
            data-info={i - getStartDay}
            onClick={
              disableDate || disableSpecificDate || disableDayState
                ? undefined
                : () => highLight(selectType === "range" ? dateTypeId : dateId, dateTypeId)
            }
            aria-hidden="true"
          >
            <div>
              {slotsState && (
                <span data-info={i - getStartDay} className="cld_slots cld_availableSlots">
                  {slotIndex ? slotIndex.avaliableSlot : 0}
                </span>
              )}
              <div data-info={i - getStartDay} className={tdStyles}>
                {i - getStartDay}
              </div>
              {duelSlots.length > 0 && (
                <span data-info={i - getStartDay} className="cld_slots cld_totalSlots">
                  {slotIndex ? slotIndex.totalSlot : 0}
                </span>
              )}
            </div>
          </td>,
        );
      }
    }

    const trDate = [];
    for (let j = 0; j < noOfDate.length; j += 1) {
      let count = 0 + j;
      if (j % 7 === 0) {
        trDate.push(
          <tr key={count}>
            {noOfDate[count + 0] || <td key={count + 0} />}
            {noOfDate[count + 1] || <td key={count + 1} />}
            {noOfDate[count + 2] || <td key={count + 2} />}
            {noOfDate[count + 3] || <td key={count + 3} />}
            {noOfDate[count + 4] || <td key={count + 4} />}
            {noOfDate[count + 5] || <td key={count + 5} />}
            {noOfDate[count + 6] || <td key={count + 6} />}
          </tr>,
        );
        count += 1;
      }
    }
    setCalenderDates(trDate);
  }, [
    templateClr,
    getDate,
    getStartDay,
    dynMonth,
    dynYear,
    rangeId,
    startAndendDate.startDate,
    startAndendDate.endDate,
    inRange,
    selectType,
    baseId,
    disableState,
    minDate,
    disableDates,
    maxDate,
    disableCertainDate,
    disableDays,
    daysInMonth,
    duelSlots,
    singleSlots,
    slotsDate,
    highLight,
  ]);

  useEffect(() => {
    handleRenderDate();
  }, [handleRenderDate, dynMonth, dynYear, baseId, rangeId, inRange]);

  /**
   * Action type for decrease the month and year
   */
  const handleLeft = () => {
    handleDisableArrow();
    setGetDate(new Date(dynYear, dynMonth - 1, 0).getDate());
    setGetStartDay(new Date(dynYear, dynMonth - 2, 1).getDay());
    if (dynMonth === 1) {
      setDynYear(dynYear - 1);
      setDynMonth(12);
    } else {
      setDynMonth(dynMonth - 1);
    }
  };

  /**
   * Action type for increase the month and year
   */
  const handleRight = () => {
    handleDisableArrow();
    setGetDate(new Date(dynYear, dynMonth + 1, 0).getDate());
    setGetStartDay(new Date(dynYear, dynMonth, 1).getDay());
    if (dynMonth === 12) {
      setDynYear(dynYear + 1);
      setDynMonth(1);
    } else {
      setDynMonth(dynMonth + 1);
    }
  };

  /**
   * Action type for select the specific month
   *
   * @param {object} e contain selected option value
   */
  const handleSelectMonth = (e) => {
    setDynMonth(Number(e.target.value) + 1);
    setGetDate(new Date(dynYear, Number(e.target.value) + 1, 0).getDate());
    setGetStartDay(new Date(dynYear, Number(e.target.value), 1).getDay());
  };

  /**
   * Action type for select the specific year
   *
   * @param {object} e contain selected option value
   */
  const handleSelectYear = (e) => {
    setDynYear(Number(e.target.value));
    setGetDate(new Date(e.target.value, dynMonth, 0).getDate());
    setGetStartDay(new Date(e.target.value, dynMonth - 1, 1).getDay());
  };

  /**
   * Action type for select the specific year
   *
   * @param {object} id contain selected date
   */
  const rangeCalculaterFromField = (id) => {
    if (id.startDateFromField && id.endDateFromField) {
      const getStartDate = id.startDateFromField;
      const getEndDate = id.endDateFromField;

      const range = dateRange(new Date(getStartDate), new Date(getEndDate));
      const allRangeDate = range.map(
        (date) => `${addZero(date.getDate())}${addZero(date.getMonth() + 1)}${date.getFullYear()}`,
      );

      setRangeId(allRangeDate);
      setStartAndendDate({
        startDate: setCurrentTime(id.startDateFromField),
        endDate: setCurrentTime(id.endDateFromField),
      });
    } else {
      const idDate = new Date(id.startDateFromField || id.endDateFromField);
      const convertID = `${addZero(idDate.getDate())}${addZero(idDate.getMonth() + 1)}${idDate.getFullYear()}`;
      setRangeId([convertID]);
      setStartAndendDate((prevState) => ({
        ...prevState,
        startDate: setCurrentTime(id.startDateFromField) || setCurrentTime(id.endDateFromField),
      }));
    }

    if (id.from) {
      const refreshDate =
        id.from === "startDateSelect" ? new Date(id.startDateFromField) : new Date(id.endDateFromField);
      setDynMonth(refreshDate.getMonth() + 1);
      setGetDate(new Date(refreshDate.getFullYear(), refreshDate.getMonth() + 1, 0).getDate());
      setGetStartDay(new Date(refreshDate.getFullYear(), refreshDate.getMonth(), 1).getDay());
      setDynYear(refreshDate.getFullYear());
    }
  };

  /**
   * Return the selected date range from date-input field
   *
   * @param {object} da contain selected option value
   */
  const setFieldValue = (da) => {
    if (selectType !== "range") {
      const selDt = new Date(da.startDateFromField);
      const fieldFindDaysInMonth = new Date(selDt.getFullYear(), selDt.getMonth() + 1, 0).getDate();
      const fieldFindStartDayInMonth = new Date(selDt.getFullYear(), selDt.getMonth(), 1).getDay();
      const dateIdFromFiled = `${addZero(selDt.getDate())}${addZero(selDt.getMonth() + 1)}${selDt.getFullYear()}`;
      const actualDateFromFiled = `${selDt.getFullYear()}-${selDt.getMonth() + 1}-${selDt.getDate()}`;

      setDynYear(selDt.getFullYear());
      setDynMonth(selDt.getMonth() + 1);
      setGetDate(fieldFindDaysInMonth);
      setGetStartDay(fieldFindStartDayInMonth);

      switch (selectType) {
        case "single":
          setBaseId([dateIdFromFiled]);
          setStartDate(setCurrentTime(actualDateFromFiled));
          break;
        case "multiple":
          if (!baseId.includes(dateIdFromFiled)) {
            setBaseId((oldArray) => [...oldArray, dateIdFromFiled]);
            setMultipleDate((oldArray) => [...oldArray, setCurrentTime(actualDateFromFiled)]);
          }
          break;
        default:
      }
    } else {
      rangeCalculaterFromField(da);
    }
  };

  /**
   *@returns {string} seletedDate from calendar single || multiple || range
   */
  const selectedDateFromCldFunc = () => {
    let selDate;
    if (selectType === "single") {
      selDate = startDate;
    } else if (selectType === "multiple") {
      selDate = multipleDate ? multipleDate[multipleDate.length - 1] : "";
    } else {
      selDate = startAndendDate;
    }
    return selDate;
  };

  /**
   *@returns {string} calendar contaier
   */
  const calendarContainer = () => {
    if (duelSlots.length > 0) {
      return "cld_slotWidth";
    }
    if (singleSlots.length > 0) {
      return "cld_avlSlotWidth";
    }
    return "cld_noslotWidth";
  };

  return (
    <div className={`${calendarContainer()} cld_container`}>
      <div>
        {showDateInputField && (
          <CldDateField
            selectedDate={(da) => setFieldValue(da)}
            selectType={selectType}
            selectedDateFromCld={selectedDateFromCldFunc()}
            disableState={disableState}
            propsMinDate={minDate}
            propsMaxDate={maxDate}
            disableCertainDate={disableCertainDate}
            disableDays={disableDays}
            daysInMonth={daysInMonth}
            showDatelabel={showDatelabel}
            templateClr={templateClr}
          />
        )}
        <div className={`${showArrow ? "cld_btnAlign" : "cld_monthYearAlign"}`}>
          {showArrow && (
            <button
              disabled={disableLeftArrow(disableState, disableArrow, dynYear, dynMonth, minDate)}
              onClick={() => handleLeft()}
              type="button"
            >
              ◀
            </button>
          )}
          <div className="cld_showDays">
            <SelectMonthField
              disableState={disableState}
              dynMonth={dynMonth}
              dynYear={dynYear}
              handleChangeSelect={(e) => handleSelectMonth(e)}
              showSelectMonthArrow={showSelectMonthArrow}
              minDate={minDate}
              maxDate={maxDate}
            />
            <SelectYearField
              startAndendYearOptions={startAndendYearOptions}
              dynYear={dynYear}
              handleChangeSelect={(e) => handleSelectYear(e)}
              showSelectYearArrow={showSelectYearArrow}
            />
          </div>
          {showArrow && (
            <button
              // disabled={(disableState === "future" && disableArrow) || (dynYear === 2100 && dynMonth === 12)}
              disabled={disableRightArrow(disableState, disableArrow, dynYear, dynMonth, maxDate)}
              onClick={() => handleRight()}
              type="button"
            >
              ▶
            </button>
          )}
        </div>
      </div>
      <table onMouseLeave={rangeId.length === 1 ? () => setInRange(null) : undefined}>
        <thead>
          <tr>
            {days.map((d) => (
              <th key={d}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>{calenderDates}</tbody>
      </table>
      {slotInfo && (
        <Legends
          templateClr={templateClr}
          singleSlotState={singleSlots.length > 0}
          duelSlotState={duelSlots.length > 0}
        />
      )}
    </div>
  );
}

Calendar.propTypes = {
  selectDateType: PropTypes.string,
  disableDates: PropTypes.arrayOf(PropTypes.object),
  disableCertainDates: PropTypes.arrayOf(PropTypes.object),
  duelSlotDates: PropTypes.arrayOf(PropTypes.object),
  singleSlotDates: PropTypes.arrayOf(PropTypes.object),
  onSelect: PropTypes.func.isRequired,
  slotInfo: PropTypes.bool,
  showDateInputField: PropTypes.bool,
  showArrow: PropTypes.bool,
  showSelectMonthArrow: PropTypes.bool,
  showSelectYearArrow: PropTypes.bool,
  showDatelabel: PropTypes.bool,
  templateClr: PropTypes.string,
  minDate: PropTypes.string.isRequired,
  maxDate: PropTypes.string.isRequired,
  defaultValue: PropTypes.string.isRequired,
  disableDays: PropTypes.string.isRequired,
};

Calendar.defaultProps = {
  selectDateType: "",
  disableDates: [],
  disableCertainDates: [],
  duelSlotDates: [],
  singleSlotDates: [],
  slotInfo: true,
  showDateInputField: true,
  showArrow: true,
  showSelectMonthArrow: false,
  showSelectYearArrow: false,
  showDatelabel: false,
  templateClr: "",
};

export default Calendar;
