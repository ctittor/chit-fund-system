import React from "react";
export default function Alert({ type = "error", message }) {
  const classes =
    type === "error"
      ? "bg-red-200 text-red-700 p-3 rounded"
      : "bg-green-200 text-green-700 p-3 rounded";
  return <div className={classes}>{message}</div>;
}
