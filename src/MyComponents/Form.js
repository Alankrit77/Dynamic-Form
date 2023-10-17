import React, { useState } from "react";
import axios from "axios";
import { Typography, TextField, Checkbox, Button, Box } from "@mui/material";
import DatePicker from "react-datepicker";
import { useSnackbar } from "notistack";
import "./Form.css";
function Form() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [apiUrl, setApiUrl] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const handleApiUrlChange = (e) => {
    setApiUrl(e.target.value);
  };

  const handleGetClick = async () => {
    if (!apiUrl) {
      enqueueSnackbar("Please fill in the URL field.", {
        variant: "warning",
      });
      return;
    }

    try {
      const response = await axios.get(apiUrl);
      setData(response.data.data);
      setIsFormVisible(true);
    } catch (error) {
      console.error("error", error);
    }
  };
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  function submit() {
    const hasNullValue = data.some((form) => {
      const value = formData[form.Field];
      if (form.Null === "NO") {
        return value == null || value == "" || value == undefined;
      }
      return false;
    });
    if (hasNullValue) {
      enqueueSnackbar("Fields must have an entry", {
        variant: "warning",
      });
    }
    const payload = {
      data: Object.entries(formData).map(([Field, Value]) => ({
        Field,
        Value,
      })),
    };
    console.log("payload", payload);

    axios
      .post("http://13.231.17.170:8080/test/submit", payload, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("sendData:", response.data);
      })
      .catch((error) => {
        console.error("error", error);
      });
  }

  return (
    <Box sx={{ width: 1 }}>
      <div className="form-container">
        <div>
          <TextField
            label="API URL"
            size="small"
            style={{ margin: "1px" }}
            value={apiUrl}
            onChange={handleApiUrlChange}
          />
          <Button
            style={{ padding: "8px" }}
            className="button"
            variant="contained"
            color="primary"
            onClick={handleGetClick}
          >
            Get
          </Button>

          {isFormVisible &&
            data &&
            data.map((form) => (
              <div key={form.Field}>
                <Typography>{form.Field + ":"}</Typography>
                {form.Type === "tinyint" ? (
                  // checkbox
                  <Checkbox
                    type="checkbox"
                    name={form.Field}
                    onChange={(e) =>
                      handleInputChange(form.Field, e.target.checked)
                    }
                  />
                ) : form.Type === "Datetime" || form.Type === "Date" ? (
                  // datepicker
                  <DatePicker
                    size="small"
                    selected={
                      formData[form.Field]
                        ? new Date(formData[form.Field])
                        : null
                    }
                    onChange={(e) =>
                      handleInputChange(form.Field, e.target.value)
                    }
                    showTimeSelect
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                  />
                ) : form.Type === "int" || form.Type === "varchar" ? (
                  // text field
                  <TextField
                    size="small"
                    type="text"
                    name={form.Field}
                    value={formData[form.Field] || ""}
                    onChange={(e) =>
                      handleInputChange(form.Field, e.target.value)
                    }
                  />
                ) : (
                  // input
                  <TextField
                    size="small"
                    type={form.Type === "decimal" ? "number" : "text"}
                    name={form.Field}
                    value={formData[form.Field] || ""}
                    onChange={(e) =>
                      handleInputChange(form.Field, e.target.value)
                    }
                  />
                )}
              </div>
            ))}

          {isFormVisible && (
            <Button
              className="button"
              onClick={submit}
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </Box>
  );
}

export default Form;
