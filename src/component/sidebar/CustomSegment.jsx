/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { message, Tabs } from "antd";
import React, { useState } from "react";
import {  useDispatch } from "react-redux";
import { setRichCardNodeCarousleData } from "../redux/reducer.button";

const CustomSegment = ({
  options = [],
  selectedNode,
  onChange,
  setOptions,
  setPreviewImage,
  setRichCardCarousels,
  richCardCarousels = [],
  previewImage = [],
  value,
  form,
}) => {
  const [activeKey, setActiveKey] = useState("0");
  const [selectedvalue,setSelectedValue] = useState(0);
  const dispatch = useDispatch();

  const handleChange = (key) => {
    setActiveKey(key);
    setSelectedValue(parseInt(key, 10));
    onChange(parseInt(key, 10));
  };

  const handleEdit = (targetKey, action) => {
    if (action === "remove") {
      handleClose(parseInt(targetKey, 10));
    }
  };

  
  const handleClose = (index) => {
    if (options.length > 2) {
      const updatedOptions = options.filter((_, i) => i !== index);
      const updatedCards = richCardCarousels.cards.filter(
        (_, i) => i !== index
      );
      const updatedImages = previewImage.filter((_, i) => i !== index);

      setOptions(updatedOptions.map((_, i) => `Card ${i + 1}`));
      setRichCardCarousels((prev) => ({
        ...prev,
        cards: updatedCards,
      }));
      setPreviewImage(updatedImages);

      if (value === index) {
        setActiveKey("0");
        onChange(0);
      } else if (value > index) {
        setActiveKey(`${value - 1}`);
        onChange(value - 1);
      } else {
        setActiveKey(`${value}`);
        onChange(value);
      }

      const data = {
        selectedNode,
        value: { ...richCardCarousels, cards: updatedCards },
        key: "richCardCarousels",
      };
      dispatch(setRichCardNodeCarousleData(data));
      form.setFieldsValue({
        ...updatedCards.reduce((acc, curr, i) => {
          acc[`title${i}`] = curr.title;
          acc[`description${i}`] = curr.description;
          acc[`media${i}`] = curr.media?._id;
          acc[`size${i}`] = curr.mediaHeight;
          curr.buttons?.forEach((button, buttonIndex) => {
            acc[`button-type-${i}-${buttonIndex}`] = button.type;
            acc[`button-title-${i}-${buttonIndex}`] = button.title;
            acc[`button-phoneNumber-${i}-${buttonIndex}`] = button.phone;
            acc[`button-url-${i}-${buttonIndex}`] = button.url;
            acc[`button-label-${i}-${buttonIndex}`] = button.label;
            acc[`button-latitude-${i}-${buttonIndex}`] = button.latitude;
            acc[`button-longitude-${i}-${buttonIndex}`] = button.longitude;
            acc[`button-startDate-${i}-${buttonIndex}`] = button.startDate;
            acc[`button-endDate-${i}-${buttonIndex}`] = button.endDate;
          });
          return acc;
        }, {}),
      });
    } else {
      message.warning("At least two cards must remain.");
    }
  };

  const items = options.map((option,index) => ({
    key: `${index}`,
    label: `Card ${index + 1}`,
    closable: options.length > 2,
  }));

  return (
    <Tabs
      type="editable-card"
      size="small"
      activeKey={activeKey}
      onChange={handleChange}
      items={items}
      onEdit={handleEdit}
    />
  );
};

export default CustomSegment;
