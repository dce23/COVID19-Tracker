import React from "react";
import numeral from "numeral";
import "./Table.css";

function StateTable({ states }) {
  return (
    <div className="table">
      {/* Go thru all of the states and map thru them and return a jsx table */}
      {states.map(({ state, cases }) => (
        <tr>
          <td>{state}</td>
          <td>
            <strong>{numeral(cases).format("0,0")}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default StateTable;
