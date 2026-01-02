
export const CreateMonthGrid = (inputDate) => {
    const year = inputDate.getFullYear();
    const monthIndex = inputDate.getMonth(); // 0-11
    const firstOfMonth = new Date(year, monthIndex, 1);

    const firstDayIndex = firstOfMonth.getDay(); // 0 = Sun ... 6 = Sat
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  
    const grid = [];
    if(firstDayIndex!==0){
     for (let i=0; i<firstDayIndex; i++){
        grid[i] = null;
     }
    }
    for(let i=0; i<daysInMonth; i++){
        grid.push(i+1)
    }

    const allRows = []
    for(let i=0; i<6; i++){
        const rows=[]
        for(let j=0; j<7; j++){
            rows.push(grid[i*7+j] ?? null)
        }
        allRows.push(rows)
    }
  
    return allRows;
  };
  