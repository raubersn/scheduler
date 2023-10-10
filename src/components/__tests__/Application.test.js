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
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));
    //console.log(prettyDOM(container));
    
    const appointment = getAllByTestId(container, "appointment")[0];
    //console.log(prettyDOM(appointment));

    fireEvent.click(getByAltText(appointment, "Add"));
    //console.log(prettyDOM(appointment));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), { target: { value: "Lydia Miller-Jones"}});
    //console.log(prettyDOM(appointment));

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    //console.log(prettyDOM(appointment));

    fireEvent.click(getByText(appointment, "Save"));
    //console.log(prettyDOM(appointment));
    //console.log(debug());
    //expect(getByText(appointment, /saving/i)).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(appointment, /saving/i));
    //console.log(prettyDOM(appointment));

    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();
    //console.log(debug());

    const mondayAppointments = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday"));
    //console.log(prettyDOM(mondayAppointments));
    
    expect(getByText(mondayAppointments, /no spots remaining/i)).toBeInTheDocument();
  });
});
