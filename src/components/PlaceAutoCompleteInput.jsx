/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { Form, Input } from "antd";
import { useJsApiLoader } from "@react-google-maps/api";

const PlaceAutocompleteInput = ({ setData, form, width }) => {
  const [autoComplete, setAutoComplete] = useState(null);
  const placeAutoCompleteRef = useRef(null);

  const libs = ["places"];
  const googleMapsPlacesApiKey =
    process.env.REACT_APP_GOOGLE_MAPS_PLACES_API_KEY;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleMapsPlacesApiKey,
    libraries: libs,
  });

  useEffect(() => {
    if (isLoaded && placeAutoCompleteRef.current) {
      const gAutoComplete = new window.google.maps.places.Autocomplete(
        placeAutoCompleteRef.current.input,
        {
          componentRestrictions: { country: "VN" },
          fields: ["address_components", "geometry", "name"],
        }
      );

      setAutoComplete(gAutoComplete);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (autoComplete) {
      autoComplete.addListener("place_changed", () => {
        const place = autoComplete.getPlace();
        let formattedAddress = "";
        const addressComponents = place.address_components;

        if (addressComponents) {
          let streetNumber = "";
          let streetName = "";
          let district = "";
          let city = "";
          let country = "";
          const districtComponent = addressComponents.find((component) =>
            component.types.some((type) =>
              [
                "sublocality_level_1",
                "administrative_area_level_3",
                "sublocality",
                "political",
              ].includes(type)
            )
          );
          if (districtComponent) {
            district = districtComponent.long_name;
          }

          addressComponents.forEach((component) => {
            const types = component.types;
            if (types.includes("street_number")) {
              streetNumber = component.long_name;
            }
            if (types.includes("route")) {
              streetName = component.long_name;
            }
            if (
              types.includes("locality") ||
              types.includes("administrative_area_level_1") ||
              types.includes("administrative_area_level_2")
            ) {
              city = component.long_name;
            }
            if (types.includes("country")) {
              country = component.long_name;
            }
          });

          formattedAddress = `${streetNumber} ${streetName}, ${district}, ${city}, ${country}`;
        }
        setData((prev) => ({
          ...prev,
          address: formattedAddress,
        }));
        form.setFieldsValue({
          address: formattedAddress,
        });
      });
    }
  }, [autoComplete]);

  return (
    <Form.Item
      name="address"
      label="Address"
      rules={[{ required: true, message: "Address is required!" }]}
      hasFeedback
      className={`w-${width ? width : "full"}`}
    >
      <Input
        ref={placeAutoCompleteRef}
        placeholder="Enter your address"
        className="w-full"
      />
    </Form.Item>
  );
};

export default PlaceAutocompleteInput;
