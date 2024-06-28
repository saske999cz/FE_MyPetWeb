import {
  Button,
  Form,
  Input,
  InputNumber,
  Upload,
  DatePicker,
  Modal,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useState, useContext, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import AuthUser from "../../../utils/AuthUser";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../../context/DataProvider";
import { LazyLoadImage } from "react-lazy-load-image-component";
import loadingImg from "../../../assets/images/loading.png";
import { FaVenus, FaMars, FaPlus } from "react-icons/fa";

const ExecuteAppointment = () => {
  const { http } = AuthUser();
  const navigate = useNavigate();
  const { data, setData } = useContext(DataContext);
  const [vaccinationHistory, setVaccinationHistory] = useState(
    data.vaccine_history
  );
  const [diagnosisHistory, setDiagnosisHistory] = useState(
    data.diagnosis_history
  );
  const [newVaccine, setNewVaccine] = useState(null);
  const [newDiagnosis, setNewDiagnosis] = useState(null);
  const [isVaccineModalOpen, setIsVaccineModalOpen] = useState(false);
  const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false);

  const handleCloseMedicalModal = () => {
    setNewDiagnosis(null);
    setIsMedicalModalOpen(false);
  };

  const handleCreateMedicalModal = () => {
    diagnosisHistory.push(newDiagnosis);
    setIsMedicalModalOpen(false);
  };

  const handleCloseVaccineModal = () => {
    setNewVaccine(null);
    setIsVaccineModalOpen(false);
  };

  const handleCreateVaccineModal = () => {
    vaccinationHistory.push(newVaccine);
    setIsVaccineModalOpen(false);
  };

  const handleUpdateAppointment = async () => {
    try {
      Swal.fire({
        title: "Processing...",
        text: "Please wait while we update the appointment.",
        allowOutsideClick: false,
        showConfirmButton: false,
        icon: "info",
        willOpen: () => {
          Swal.showLoading();
        },
      });
      const params = new URLSearchParams();
      if (newVaccine.vaccine !== "")
        params.append("vaccine", newVaccine.vaccine);
      if (newVaccine.note !== "") params.append("note", newVaccine.note);
      if (newDiagnosis.reason !== "")
        params.append("reason", newDiagnosis.reason);
      if (newDiagnosis.diagnosis !== "")
        params.append("diagnosis", newDiagnosis.diagnosis);
      if (newDiagnosis.treatment !== "")
        params.append("treatment", newDiagnosis.treatment);
      if (newDiagnosis.health_condition !== "")
        params.append("health_condition", newDiagnosis.health_condition);
      params.append("pet_id", data.pet.pet_id.toString());
      await http.patch(`/doctor/appointments/${data.appointment_id}`, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      Swal.fire({
        title: "Done",
        text: "Appointment finished successfully!",
        icon: "success",
      }).then(() => {
        navigate("/dashboard/appointment-list");
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: "Oops.. Please try again",
        icon: "error",
      });
    }
  };

  return (
    <div className="flex flex-col w-full h-full items-start justify-start gap-4">
      <div className="flex flex-col w-full items-start gap-6">
        <div className="flex flex-col w-full h-full items-start justify-start bg-white p-6 rounded-md">
          <h1 className="text text-xl w-full text-start font-semibold border-b-2 p-2 border-neutral-400">
            Basic Information
          </h1>
        </div>
        <div className="w-full h-fit flex flex-col">
          <div className="w-full h-fit flex flex-row">
            <LazyLoadImage
              src={data.pet.image_url}
              alt={`Customer detail`}
              className="w-[400px] h-[500px] bg-white object-cover rounded-[10px]"
              effect="blur"
              placeholderSrc={loadingImg}
              id="customer-detail"
            />
            <div className="w-[60%] h-fit flex-col ml-[100px]">
              <div className="w-full h-[50px] flex flex-row items-center justify-start">
                <div className="w-[40%] h-[50px] flex flex-col items-start justify-start">
                  <p className="text-[15px] font-semibold">Name:</p>
                  <p className="text[14px]">{data.pet.name}</p>
                </div>
                <div className="w-[40%] h-[50px] flex flex-col items-start justify-start">
                  <p className="text-[15px] font-semibold">Breed:</p>
                  <p className="text[14px]">{data.pet.breed.name}</p>
                </div>
              </div>
              <div className="w-full h-[50px] flex flex-row items-center justify-start mt-[30px]">
                <div className="w-[40%] h-[50px] flex flex-col items-start justify-start">
                  <p className="text-[15px] font-semibold">Gender:</p>
                  <div className="w-full h-fit flex flex-row items-center justify-start">
                    {data.pet.gender === "male" ? (
                      <FaVenus size={18} color="#3b82f6" />
                    ) : (
                      <FaMars size={18} color="#ec4899" />
                    )}
                    <p className="text[14px]">
                      {data.pet.gender === "male" ? "Male" : "Female"}
                    </p>
                  </div>
                </div>
                <div className="w-[40%] h-[50px] flex flex-col items-start justify-start">
                  <p className="text-[15px] font-semibold">Age:</p>
                  <p className="text[14px]">{data.pet.age + " years old"} </p>
                </div>
              </div>
              <div className="w-full h-[20px] mt-[40px] flex flex-row item-center justify-start">
                <p className="text-[15px] font-semibold">Medical History</p>
              </div>
              <table className="min-w-full divide-y divide-gray-200 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg mt-[20px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Vaccine
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.vaccine_history.length > 0 ? (
                    data.vaccine_history.map((vaccine) => (
                      <tr key={vaccine.vaccine_history_id}>
                        {" "}
                        {/* Added a key for each row */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {vaccine.vaccine_history_id
                            ? vaccine.vaccine_history_id
                            : "new"}{" "}
                          {/* Fixed to display vaccine id */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vaccine.vaccine}{" "}
                          {/* Fixed to display vaccine name */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vaccine.note} {/* Fixed to display vaccine note */}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500"
                      >
                        No vaccination history
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="w-full h-[45px] flex flex-row items-center justify-center mt-[15px]">
                <button
                  className="w-[220px] h-full flex flex-row items-center justify-center bg-blue-500 rounded-[5px]"
                  onClick={() => setIsVaccineModalOpen(true)}
                >
                  <FaPlus size={16} style={{ color: "white" }} />
                  <p className="text-[15px] text-white font-semibold ml-2">
                    New vaccination record
                  </p>
                </button>
              </div>
              <div className="w-full h-[20px] mt-[40px] flex flex-row item-center justify-start">
                <p className="text-[15px] font-semibold">Medical History</p>
              </div>
              <div className="mt-8">
                <div className="flex flex-col">
                  <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                ID
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Reason
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Diagnosis
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Treatment
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Note
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {/* Conditional rendering based on diagnosis history data */}
                            {data.diagnosis_history.length > 0 ? (
                              data.diagnosis_history.map((diagnosis) => (
                                <tr key={diagnosis.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {diagnosis.diagnosis_history_id
                                      ? diagnosis.diagnosis_history_id
                                      : "new"}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {diagnosis.reason}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {diagnosis.diagnosis}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {diagnosis.treatment}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {diagnosis.note}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan="5"
                                  className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500"
                                >
                                  No medical history
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full h-[45px] flex flex-row items-center justify-center mt-[15px] mb-[50px]">
                <button
                  className="w-[220px] h-full flex flex-row items-center justify-center bg-blue-500 rounded-[5px]"
                  onClick={() => setIsMedicalModalOpen(true)}
                >
                  <FaPlus size={16} style={{ color: "white" }} />
                  <p className="text-[15px] text-white font-semibold ml-2">
                    New medical record
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-2">
        <button
          className="flex flex-row items-center justify-center w-full gap-2 bg-blue-600 rounded-md px-4 py-3 hover:opacity-85 transition duration-300"
          onClick={handleUpdateAppointment}
        >
          <FaCloudUploadAlt size={24} style={{ color: "white" }} />
          <span className="text-white text-xl font-semibold">
            Finish Appointment
          </span>
        </button>
      </div>
      <Modal
        title="New vaccination record"
        open={isVaccineModalOpen}
        onOk={handleCreateVaccineModal}
        onCancel={handleCloseVaccineModal}
      >
        <div className="w-[450px] h-fit flex flex-col mt-[20px] mb-[30px]">
          <div className="w-full h-[40px] px-[10px]">
            <Input
              onChange={(e) =>
                setNewVaccine({
                  ...newVaccine,
                  vaccine: e.target.value,
                  id: null,
                })
              }
              placeholder="Enter vaccine name"
              className="w-full h-full"
            />
          </div>
          <div className="w-full h-fit px-[10px] mt-[20px]">
            <TextArea
              onChange={(e) =>
                setNewVaccine({ ...newVaccine, note: e.target.value })
              }
              placeholder="Notes(optional)"
              className="w-full h-full"
              rows={5}
            />
          </div>
        </div>
      </Modal>
      <Modal
        title="New medical record"
        open={isMedicalModalOpen}
        onOk={handleCreateMedicalModal}
        onCancel={handleCloseMedicalModal}
      >
        <div className="w-[450px] h-fit min-h-[400px] flex flex-col mt-[20px] mb-[30px]">
          <div className="w-full h-[40px] px-[10px]">
            <Input
              onChange={(e) =>
                setNewDiagnosis({
                  ...newDiagnosis,
                  reason: e.target.value,
                  id: null,
                })
              }
              placeholder="Enter reason"
              className="w-full h-full"
            />
          </div>
          <div className="w-full h-[40px] px-[10px]  mt-[20px]">
            <Input
              onChange={(e) =>
                setNewDiagnosis({ ...newDiagnosis, diagnosis: e.target.value })
              }
              placeholder="Enter diagnosis"
              className="w-full h-full"
            />
          </div>
          <div className="w-full h-[40px] px-[10px] mt-[20px]">
            <Input
              onChange={(e) =>
                setNewDiagnosis({ ...newDiagnosis, treatment: e.target.value })
              }
              placeholder="Enter treatment"
              className="w-full h-full"
            />
          </div>
          <div className="w-full h-[40px] px-[10px]  mt-[20px]">
            <Input
              onChange={(e) =>
                setNewDiagnosis({
                  ...newDiagnosis,
                  health_condition: e.target.value,
                })
              }
              placeholder="Enter health condition"
              className="w-full h-full"
            />
          </div>
          <div className="w-full h-fit px-[10px] mt-[20px]">
            <TextArea
              onChange={(e) =>
                setNewVaccine({ ...newVaccine, note: e.target.value })
              }
              placeholder="Notes(optional)"
              className="w-full h-full"
              rows={5}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ExecuteAppointment;
