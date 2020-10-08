import React from "react";
import numeral from "numeral";
import "./Table.css";

function Table({ countries }) {
  return (
    <div className="table">
      {/*Go thru all of the countries and map thru them and return a jsx table*/}
      {countries.map(({ country, cases }) => (
        <tr>
          <td>{country}</td>
          <td>
            <strong>{numeral(cases).format("0,0")}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;
