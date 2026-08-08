function SteffenPerfect(flight) {
  let m = flight.seats.length;
  let n = flight.seats[0].length;
  if (m == 0) return [];

  function getColumnTier(colIdx) {
    let min = Math.min(colIdx, n - 1 - colIdx);
    return min;
  }

  const passengerMap = new Map();
  for (const p of flight.passengers) {
    passengerMap.set(p.seat, p);
  }

  const boarders = [];
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      const occupied = flight.seats[r][c];

      if (occupied !== null && occupied !== undefined && occupied !== 0) {
        const seat = `${r + 1}${String.fromCharCode(65 + c)}`;
        const p = passengerMap.get(seat);
        if (!p) continue;

        const colTier = getColumnTier(c);

        let group;

        if (colTier === 0) group = "A";
        else if (colTier === 1) group = "B";
        else group = "C";
        boarders.push({
          id: p.id,
          name: p.name,
          flightId: p.flightId,
          boarded: p.boarded,
          passenger: occupied,
          row: r,
          col: c,
          colTier,
          isEvenRow: r % 2 === 0,
          group,
        });
      }
    }
  }
  boarders.sort((a, b) => {
    if (a.colTier !== b.colTier) {
      //Outside to inside
      return a.colTier - b.colTier;
    }
    if (a.isEvenRow !== b.isEvenRow) {
      return a.isEvenRow ? -1 : 1; // Even rows first
    }
    if (a.row !== b.row) {
      //Back to front
      return b.row - a.row;
    }
    return a.col - b.col; //Slide Alternation
  });
  return boarders.map((item, index) => ({
    id: item.id,
    name: item.name,
    flightId: item.flightId,
    boarded: item.boarded,
    queueNumber: index + 1,
    row: item.row,
    col: item.col,
    colTier: item.colTier,
    seat: `${item.row + 1}${String.fromCharCode(65 + item.col)}`,
  }));
}

function BoardingGroups(seq, layouts) {
  let totalColumns = layouts.length;
  const groups = {
    A: [], // Window
    B: [], // Middle
    C: [], // Aisle
  };

  seq.forEach((item) => {
    const col = item.col;
    const tier = Math.min(col, totalColumns - 1 - col);

    if (tier === 0) {
      groups.A.push(item);
    } else if (tier === 1) {
      groups.B.push(item);
    } else {
      groups.C.push(item);
    }
  });

  return groups;
}

export { SteffenPerfect, BoardingGroups };
