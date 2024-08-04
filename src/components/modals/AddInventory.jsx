import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Checkbox, Divider, Modal } from "rsuite";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2";
import {
  useAddItemMutation,
  useGetAllItemsQuery,
} from "../../store/api/inventoryApi";

const schema = yup.object().shape({
  itemName: yup.string().required("Item name is required"),
  itemType: yup.string().required("Item type is required"),
  itemQuantity: yup.string().required("Item quantity is required"),
  itemCode: yup.string().required("Item code is required"),
});

export default function AddInventoryModal({ open, handleClose }) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [addItem] = useAddItemMutation();
  const { refetch } = useGetAllItemsQuery();

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        itemName: data.itemName,
        type: data.itemType,
        quantity: parseInt(data.itemQuantity),
        code: data.itemCode,
        wash: data.wash ? "1" : "0",
      };
      console.log("formattedData", formattedData);

      const response = await addItem(formattedData);

      if (response.data && !response.data.error) {
        reset();
        handleClose();
        refetch();
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Item Added Successfully",
        });
      } else {
        console.log("Item adding failed", response);
        Swal.fire({
          title: "Oops...",
          text:
            response?.error?.data?.payload ||
            response?.data?.payload ||
            "Item adding failed",
          icon: "error",
        });
      }
    } catch (error) {
      console.log("Item adding error", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} className="!w-2/5 !mt-36">
      <Modal.Body className="!h-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-between items-center !h-16 mt-4 rounded-t-md px-10">
            <p className="font-semibold text-2xl ">Add New Item</p>
            <div className="border-double border-4 text-txtblue border-slate-100 bg-white rounded-full h-12 w-12 items-center flex justify-center">
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
          </div>
          <Divider className="text-txtgray !mt-2 w-11/12 !mx-auto" />
          <div className="flex justify-between w-full mt-7 px-10 space-x-10">
            <div className="flex-col w-1/2">
              <Controller
                name="itemName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="outlined-basic"
                    label="Item Name"
                    variant="outlined"
                    className="!mb-7 w-full"
                    error={!!errors.itemName}
                    helperText={errors.itemName ? errors.itemName.message : ""}
                  />
                )}
              />
              <Controller
                name="itemQuantity"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="outlined-basic"
                    label="Item Quantity"
                    variant="outlined"
                    className="!mb-5 w-full"
                    error={!!errors.itemQuantity}
                    helperText={
                      errors.itemQuantity ? errors.itemQuantity.message : ""
                    }
                  />
                )}
              />
            </div>
            <div className="flex-col w-1/2 text-right">
              <Controller
                name="itemType"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="outlined-basic"
                    label="Item Type"
                    variant="outlined"
                    className="!mb-7 w-full"
                    error={!!errors.itemType}
                    helperText={errors.itemType ? errors.itemType.message : ""}
                  />
                )}
              />
              <Controller
                name="itemCode"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="outlined-basic"
                    label="Item Code"
                    variant="outlined"
                    className="!mb-5 w-full"
                    error={!!errors.itemCode}
                    helperText={errors.itemCode ? errors.itemCode.message : ""}
                  />
                )}
              />
            </div>
          </div>
          <div className="flex w-full px-10">
            <Controller
              name="wash"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value}
                  onChange={(value, checked) => field.onChange(checked)}
                >
                  A Washable Item
                </Checkbox>
              )}
            />
          </div>
          <div className="w-full flex flex-row justify-end mt-7 mb-4 px-10">
            <button
              type="button"
              onClick={() => {
                reset();
                handleClose();
              }}
              className="w-1/2 h-10 rounded-md mr-4 border-solid border border-slate-300 hover:bg-slate-200 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 h-10 rounded-md bg-blue-700 text-white hover:bg-blue-800 transition-all duration-300"
            >
              Create
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
