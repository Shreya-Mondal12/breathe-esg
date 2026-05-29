import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [file, setFile] = useState(null);

  const [records, setRecords] = useState([]);

  const [auditLogs, setAuditLogs] = useState([]);

  const [uploadHistory, setUploadHistory] = useState([]);

  const [filter, setFilter] = useState("ALL");

  const [search, setSearch] = useState("");

  const [sourceType, setSourceType] = useState("SAP");

  // =========================================
  // FETCH RECORDS
  // =========================================

  const fetchRecords = async () => {

    try {

      const response = await axios.get(
        "https://breathe-esg-5m0j.onrender.com/api/emissions/"
      );

      setRecords(response.data);

    } catch (error) {

      console.error(error);
    }
  };

  // =========================================
  // FETCH AUDIT LOGS
  // =========================================

  const fetchAuditLogs = async () => {

    try {

      const response = await axios.get(
        "https://breathe-esg-5m0j.onrender.com/api/audit/"
      );

      setAuditLogs(response.data);

    } catch (error) {

      console.error(error);
    }
  };

  // =========================================
  // FETCH UPLOAD HISTORY
  // =========================================

  const fetchUploadHistory = async () => {

    try {

      const response = await axios.get(
        "https://breathe-esg-5m0j.onrender.com/api/ingestion/history/"
      );

      setUploadHistory(response.data);

    } catch (error) {

      console.error(error);
    }
  };

  // =========================================
  // LOAD INITIAL DATA
  // =========================================

  useEffect(() => {

    fetchRecords();

    fetchAuditLogs();

    fetchUploadHistory();

  }, []);

  // =========================================
  // HANDLE FILE UPLOAD
  // =========================================

  const handleUpload = async () => {

    if (!file) {

      alert("Please select file");

      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    formData.append(
      "source_type",
      sourceType
    );

    formData.append(
      "company_id",
      1
    );

    try {

      await axios.post(
        "https://breathe-esg-5m0j.onrender.com/api/ingestion/upload/",
        formData
      );

      alert(
        "CSV uploaded successfully"
      );

      fetchRecords();

      fetchAuditLogs();

      fetchUploadHistory();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.error ||
        "Upload failed"
      );
    }
  };

  // =========================================
  // UPDATE REVIEW STATUS
  // =========================================

  const updateStatus = async (
    recordId,
    status
  ) => {

    try {

      await axios.post(
        `https://breathe-esg-5m0j.onrender.com/api/emissions/review/${recordId}/`,
        {
          status: status
        }
      );

      fetchRecords();

      fetchAuditLogs();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.error ||
        "Status update failed"
      );
    }
  };
  const resetAllData = async () => {

  const confirmed = window.confirm(
    "Are you sure you want to delete all uploaded data?"
  );

  if (!confirmed) {
    return;
  }

  try {

    await axios.post(
      "https://breathe-esg-5m0j.onrender.com/api/reset/"
    );

    alert("All data reset successfully");

    fetchRecords();

    fetchAuditLogs();

    fetchUploadHistory();

  } catch (error) {

    console.error(error);

    alert("Reset failed");
  }
};

  // =========================================
  // STATUS COLORS
  // =========================================

  const getStatusColor = (status) => {

    if (status === "SUSPICIOUS") {
      return "bg-red-500";
    }

    if (status === "FAILED") {
      return "bg-yellow-500";
    }

    if (status === "APPROVED") {
      return "bg-blue-500";
    }

    if (status === "REJECTED") {
      return "bg-gray-700";
    }

    return "bg-green-500";
  };

  // =========================================
  // STATS
  // =========================================

  const totalRecords = records.length;

  const suspiciousCount = records.filter(
    (r) =>
      r.review_status === "SUSPICIOUS"
  ).length;

  const approvedCount = records.filter(
    (r) =>
      r.review_status === "APPROVED"
  ).length;

  const rejectedCount = records.filter(
    (r) =>
      r.review_status === "REJECTED"
  ).length;

  // =========================================
  // FILTER + SEARCH
  // =========================================

  const filteredRecords = records.filter(
    (record) => {

      const matchesFilter =
        filter === "ALL" ||
        record.review_status === filter;

      const matchesSearch =

        record.company
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        record.activity_type
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        String(record.unit)
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      return (
        matchesFilter &&
        matchesSearch
      );
    }
  );

  return (

     <div className="min-h-screen bg-slate-100 text-slate-800">

      <div className="max-w-7xl mx-auto px-6 py-8">

      

{/* HEADER */}

<div className="
  flex
  flex-col
  lg:flex-row
  lg:items-center
  lg:justify-between
  gap-4
  mb-10
">

  {/* LEFT */}

  <div>

    <h1 className="
      text-4xl
      font-bold
      text-slate-900
      tracking-tight
    ">
      ESG Emissions Dashboard
    </h1>

    <p className="
      text-slate-500
      mt-2
      text-sm
    ">
      Multi-source ingestion, validation and analyst review workflow
    </p>

  </div>

  {/* RIGHT */}

  <button
    onClick={resetAllData}
    className="
      bg-red-500
      hover:bg-red-600
      text-white
      px-5
      py-3
      rounded-xl
      shadow-sm
      transition
      font-medium
      w-fit
    "
  >
    Reset Workspace
  </button>

</div>

      {/* KPI CARDS */}

<div className="
  grid
  grid-cols-1
  sm:grid-cols-2
  xl:grid-cols-4
  gap-5
  mb-10
">

  {/* TOTAL */}

  <div className="
    bg-white
    border
    border-slate-200
    rounded-2xl
    p-6
    shadow-sm
  ">

    <p className="
      text-sm
      text-slate-500
      font-medium
    ">
      Total Records
    </p>

    <h2 className="
      text-4xl
      font-bold
      mt-3
      text-slate-900
    ">
      {totalRecords}
    </h2>

  </div>

  {/* SUSPICIOUS */}

  <div className="
    bg-white
    border
    border-red-200
    rounded-2xl
    p-6
    shadow-sm
  ">

    <p className="
      text-sm
      text-red-500
      font-medium
    ">
      Suspicious
    </p>

    <h2 className="
      text-4xl
      font-bold
      mt-3
      text-red-600
    ">
      {suspiciousCount}
    </h2>

  </div>

  {/* APPROVED */}

  <div className="
    bg-white
    border
    border-blue-200
    rounded-2xl
    p-6
    shadow-sm
  ">

    <p className="
      text-sm
      text-blue-500
      font-medium
    ">
      Approved
    </p>

    <h2 className="
      text-4xl
      font-bold
      mt-3
      text-blue-600
    ">
      {approvedCount}
    </h2>

  </div>

  {/* REJECTED */}

  <div className="
    bg-white
    border
    border-slate-300
    rounded-2xl
    p-6
    shadow-sm
  ">

    <p className="
      text-sm
      text-slate-500
      font-medium
    ">
      Rejected
    </p>

    <h2 className="
      text-4xl
      font-bold
      mt-3
      text-slate-700
    ">
      {rejectedCount}
    </h2>

  </div>

</div>
      {/* CONTROLS */}

<div className="
  bg-white
  border
  border-slate-200
  rounded-2xl
  shadow-sm
  p-5
  mb-8
">

  <div className="
    flex
    flex-col
    xl:flex-row
    gap-5
    xl:items-center
    xl:justify-between
  ">

    {/* SEARCH */}

    <div className="flex-1">

      <input
        type="text"
        placeholder="Search company, activity or unit..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="
          w-full
          xl:max-w-md
          px-4
          py-3
          rounded-xl
          border
          border-slate-300
          bg-white
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
        "
      />

    </div>

    {/* FILTER BUTTONS */}

    <div className="
      flex
      flex-wrap
      gap-3
    ">

      <button
        onClick={() => setFilter('ALL')}
        className={`
          px-4
          py-2
          rounded-xl
          text-sm
          font-medium
          transition

          ${
            filter === 'ALL'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }
        `}
      >
        All
      </button>

      <button
        onClick={() => setFilter('PENDING')}
        className={`
          px-4
          py-2
          rounded-xl
          text-sm
          font-medium
          transition

          ${
            filter === 'PENDING'
              ? 'bg-yellow-500 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }
        `}
      >
        Pending
      </button>

      <button
        onClick={() => setFilter('SUSPICIOUS')}
        className={`
          px-4
          py-2
          rounded-xl
          text-sm
          font-medium
          transition

          ${
            filter === 'SUSPICIOUS'
              ? 'bg-red-500 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }
        `}
      >
        Suspicious
      </button>

      <button
        onClick={() => setFilter('APPROVED')}
        className={`
          px-4
          py-2
          rounded-xl
          text-sm
          font-medium
          transition

          ${
            filter === 'APPROVED'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }
        `}
      >
        Approved
      </button>

      <button
        onClick={() => setFilter('REJECTED')}
        className={`
          px-4
          py-2
          rounded-xl
          text-sm
          font-medium
          transition

          ${
            filter === 'REJECTED'
              ? 'bg-slate-700 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }
        `}
      >
        Rejected
      </button>

    </div>

  </div>

</div>
      {/* UPLOAD */}

      <div className="
  bg-white
  border
  border-slate-200
  rounded-2xl
  shadow-sm
  p-8
  mb-8
  max-w-3xl
  mx-auto
">

        <h2 className="
  text-2xl
  font-bold
  text-slate-900
  mb-6
  text-center
">
          Upload CSV
        </h2>

        <select
          value={sourceType}
          onChange={(e) =>
            setSourceType(
              e.target.value
            )
          }
          className="
  w-full
  px-4
  py-3
  rounded-xl
  border
  border-slate-300
  bg-white
  focus:outline-none
  focus:ring-2
  focus:ring-blue-500
  mb-5
"
        >

          <option value="SAP">
            SAP Fuel / Procurement
          </option>

          <option value="UTILITY">
            Utility Electricity
          </option>

          <option value="TRAVEL">
            Corporate Travel
          </option>

        </select>

        <input
          type="file"
          onChange={(e) =>
            setFile(
              e.target.files[0]
            )
          }
          className="
  w-full
  border
  border-slate-300
  rounded-xl
  p-3
  bg-white
"
        />
<div className="flex justify-center">

  <button
    onClick={handleUpload}
    className="
      mt-2
      bg-blue-600
      hover:bg-blue-700
      text-white
      px-6
      py-3
      rounded-xl
      transition
      font-medium
      shadow-sm
    "
  >
    Upload File
  </button>

</div>

</div>

{/* UPLOAD HISTORY */}

<div className="
  bg-white
  border
  border-slate-200
  rounded-2xl
  shadow-sm
  p-6
  mb-8
  overflow-x-auto
">

  <h2 className="
    text-2xl
    font-bold
    text-slate-900
    mb-6
  ">
    Upload History
  </h2>

  <table className="w-full text-sm">

    <thead className="
      bg-slate-50
      text-slate-600
      uppercase
      text-xs
      tracking-wide
    ">

      <tr>

        <th className="px-4 py-4 text-left">
          File Name
        </th>

        <th className="px-4 py-4 text-left">
          Source Type
        </th>

        <th className="px-4 py-4 text-left">
          Uploaded At
        </th>

      </tr>

    </thead>

    <tbody>

      {uploadHistory.map((upload) => (

        <tr
          key={upload.id}
          className="
            border-b
            border-slate-100
            hover:bg-slate-50
            transition
          "
        >

          <td className="px-4 py-4 font-medium">
            {upload.file_name}
          </td>

          <td className="px-4 py-4">

            <span className="
              bg-slate-100
              text-slate-700
              px-3
              py-1
              rounded-full
              text-xs
              font-semibold
            ">
              {upload.source_type}
            </span>

          </td>

          <td className="px-4 py-4 text-slate-500">
            {new Date(
              upload.uploaded_at
            ).toLocaleString()}
          </td>

        </tr>

      ))}

    </tbody>

  </table>

</div>
      {/* EMISSION TABLE */}

      <div className="
  bg-white
  border
  border-slate-200
  rounded-2xl
  shadow-sm
  p-6
  overflow-x-auto
  mb-8
">

        <h2 className="
  text-2xl
  font-bold
  text-slate-900
  mb-6
">
          Emission Records
        </h2>

        <table className="w-full text-sm">

          <thead className="
  bg-slate-50
  text-slate-600
  uppercase
  text-xs
  tracking-wide
">

            <tr>

              <th className="p-3 text-left">
                Company
              </th>

              <th className="p-3 text-left">
                Activity
              </th>

              <th className="p-3 text-left">
                Quantity
              </th>

              <th className="p-3 text-left">
                Unit
              </th>

              <th className="p-3 text-left">
                Normalized
              </th>

              <th className="p-3 text-left">
                Status
              </th>

              <th className="p-3 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredRecords.map((record) => (

              <tr
                key={record.id}
                className="
  border-b
  border-slate-100
  hover:bg-slate-50
  transition
"
              >

                <td className="px-4 py-4">
                  {record.company}
                </td>

                <td className="px-4 py-4">
                  {record.activity_type}
                </td>

                <td className="px-4 py-4">
                  {record.quantity}
                </td>

                <td className="px-4 py-4">
                  {record.unit || "-"}
                </td>

                <td className="px-4 py-4">
                  {record.normalized_unit || "-"}
                </td>

                <td className="px-4 py-4">

                  <span
                    className={`
  text-white
  px-3
  py-1
  rounded-full
  text-xs
  font-semibold
                      ${getStatusColor(
                        record.review_status
                      )}
                    `}
                  >
                    {record.review_status}
                  </span>

                </td>

                <td className="p-3 flex gap-2">

                  <button
                    disabled={
                      record.review_status === "APPROVED" ||
                      record.review_status === "REJECTED"
                    }
                    onClick={() =>
                      updateStatus(
                        record.id,
                        "APPROVED"
                      )
                    }
                    className="
                      bg-blue-500
                      text-white
                      px-3
                      py-1
                      rounded
                      hover:bg-blue-600
                      disabled:opacity-50
                    "
                  >
                    Approve
                  </button>

                  <button
                    disabled={
                      record.review_status === "APPROVED" ||
                      record.review_status === "REJECTED"
                    }
                    onClick={() =>
                      updateStatus(
                        record.id,
                        "REJECTED"
                      )
                    }
                    className="
                      bg-gray-600
                      text-white
                      px-3
                      py-1
                      rounded
                      hover:bg-gray-700
                      disabled:opacity-50
                    "
                  >
                    Reject
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* AUDIT LOGS */}

      <div className="
  bg-white
  border
  border-slate-200
  rounded-2xl
  shadow-sm
  p-6
  overflow-x-auto
">

        <h2 className="text-2xl font-semibold mb-4">
          Audit Logs
        </h2>

        <table className="w-full border-collapse">

          <thead>

            <tr className="bg-gray-200">

              <th className="p-3 text-left">
                Record
              </th>

              <th className="p-3 text-left">
                Action
              </th>

              <th className="p-3 text-left">
                Old
              </th>

              <th className="p-3 text-left">
                New
              </th>

              <th className="p-3 text-left">
                By
              </th>

              <th className="p-3 text-left">
                Time
              </th>

            </tr>

          </thead>

          <tbody>

            {auditLogs.map((log) => (

              <tr
                key={log.id}
                className="border-b"
              >

                <td className="px-4 py-4">
                  {log.record_id}
                </td>

                <td className="px-4 py-4">
                  {log.action}
                </td>

                <td className="px-4 py-4">
                  {log.old_value?.review_status || "-"}
                </td>

                <td className="px-4 py-4">
                  {log.new_value?.review_status || "-"}
                </td>

                <td className="px-4 py-4">
                  {log.changed_by}
                </td>

                <td className="px-4 py-4">
                  {new Date(
                    log.changed_at
                  ).toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
    </div>
  );
}

export default App;