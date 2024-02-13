import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "../Redux/Actions/RoomsDataActions";
import MyEditor from "./MyEditor";

export default function CodePlayground() {
  document.title = "Code Playground | ClassRoom Plus";

  const [savedCodes, setSavedCodes] = useState(
    localStorage.savedPlaygroundCodes
      ? JSON.parse(localStorage.getItem("savedPlaygroundCodes"))
      : []
  );

  const [selectedCode, setSelectedCode] = useState({
    id: Math.floor(Math.random() * 100000),
    name: "",
    code: "",
    language: "cpp",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: "Code Playground",
          url: "/code",
        },
      ])
    );
    localStorage.setItem("savedPlaygroundCodes", JSON.stringify(savedCodes));
  }, [savedCodes]);

  return (
    <MyEditor
      savedCodes={savedCodes}
      setSavedCodes={setSavedCodes}
      selectedCode={selectedCode}
      setSelectedCode={setSelectedCode}
    />
  );
}
