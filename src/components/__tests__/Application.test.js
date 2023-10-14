import axios from "axios";

/*
  We are rendering `<Application />` down below, so we need React.createElement
*/
import React from "react";

/*
  We import our helper functions from the react-testing-library
  The render function allows us to render Components
*/
import { fireEvent, render, waitForElement, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, waitForElementToBeRemoved, queryByText } from "@testing-library/react";

/*
  We import the component that we are testing
*/
import Application from "components/Application";

describe("Application", () => {
  /*
    A test that renders a React Component
  */
  xit("renders without crashing", () => {
    render(<Application />);
  });

  xit("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
  
    await waitForElement(() => getByText("Monday"));
  
    fireEvent.click(getByText("Tuesday"));
  
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    // 3. Click the "Add" button on the first empty appointment.
    const appointment = getAllByTestId(container, "appointment")[0];
    fireEvent.click(getByAltText(appointment, "Add"));
    
    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), { target: { value: "Lydia Miller-Jones" } });
    
    // 5. Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    
    // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, /saving/i)).toBeInTheDocument();

    // 7. Check that the element with the text "Saving" is displayed.
    await waitForElementToBeRemoved(() => getByText(appointment, /saving/i));
    
    // 8. Wait until the element with the text "Lydia Miller-Jones" is displayed.
    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();
    
    // 9. Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
    const mondayAppointments = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday"));
    expect(getByText(mondayAppointments, /no spots remaining/i)).toBeInTheDocument();

    //debug();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    // 3. Click the "Delete" button on that same appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Delete"));
    
    // 4. Check that the "Confirm" element is displayed.
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // 5. Click the "Confirm" button on that same appointment.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    
    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const mondayAppointments = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday"));
    expect(getByText(mondayAppointments, /2 spots remaining/i)).toBeInTheDocument();

    //debug();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    // 3. Click the "Edit" button on that same appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Edit"));

    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), { target: { value: "Lydia Miller-Jones" } });
    
    // 5. Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, /saving/i)).toBeInTheDocument();

    // 7. Check that the element with the text "Saving" is displayed.
    await waitForElementToBeRemoved(() => getByText(appointment, /saving/i));

    // 8. Wait until the element with the text "Lydia Miller-Jones" is displayed.
    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    // 9. Check that the element with the text "Sylvia Palmer" is displayed.
    expect(getByText(appointment, "Sylvia Palmer")).toBeInTheDocument();

    //10. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const mondayAppointments = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday"));
    expect(getByText(mondayAppointments, /1 spot remaining/i)).toBeInTheDocument();
    
    //debug();
  });

  it("shows the save error when failing to save an appointment", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    // 3. Click the "Add" button on the first empty appointment.
    const appointment = getAllByTestId(container, "appointment")[0];
    fireEvent.click(getByAltText(appointment, "Add"));
    
    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), { target: { value: "Lydia Miller-Jones" } });
    
    // 5. Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    
    // 6. Click the "Save" button on that same appointment.
    axios.put.mockRejectedValueOnce();
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, /saving/i)).toBeInTheDocument();

    // 7. Check that the element with the text "Saving" is displayed.
    await waitForElementToBeRemoved(() => getByText(appointment, /saving/i));

    // 8. Wait until the element with the error message "Could not book appointment." is displayed.
    expect(getByText(appointment, "Could not book appointment.")).toBeInTheDocument();

    //10. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const mondayAppointments = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday"));
    expect(getByText(mondayAppointments, /1 spot remaining/i)).toBeInTheDocument();

    //debug();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    // 3. Click the "Delete" button on that same appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Delete"));
    
    // 4. Check that the "Confirm" element is displayed.
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // 5. Click the "Confirm" button on that same appointment.
    axios.delete.mockRejectedValueOnce();
    fireEvent.click(getByText(appointment, "Confirm"));

    // // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Check that the element with the text "Deleting" is displayed.
    await waitForElementToBeRemoved(() => getByText(appointment, /deleting/i));

    // 8. Wait until the element with the error message "Could not book appointment." is displayed.
    expect(getByText(appointment, "Could not book appointment.")).toBeInTheDocument();

    //10. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const mondayAppointments = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday"));
    expect(getByText(mondayAppointments, /1 spot remaining/i)).toBeInTheDocument();

    // debug();
  });
});
