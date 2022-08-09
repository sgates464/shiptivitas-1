import React from "react";
import Dragula from "dragula";
import "dragula/dist/dragula.css";
import Swimlane from "./Swimlane";
import "./Board.css";

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();
    this.state = {
      clients: {
        backlog: clients.filter(
          (client) => !client.status || client.status === "backlog"
        ),
        inProgress: clients.filter(
          (client) => client.status && client.status === "in-progress"
        ),
        complete: clients.filter(
          (client) => client.status && client.status === "complete"
        ),
      },
    };
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    };
  }
  getClients() {
    return [
      [
        "1",
        "Stark, White and Abbott",
        "Cloned Optimal Architecture",
        "in-progress",
      ],
      [
        "2",
        "Wiza LLC",
        "Exclusive Bandwidth-Monitored Implementation",
        "complete",
      ],
      [
        "3",
        "Nolan LLC",
        "Vision-Oriented 4Thgeneration Graphicaluserinterface",
        "backlog",
      ],
      [
        "4",
        "Thompson PLC",
        "Streamlined Regional Knowledgeuser",
        "in-progress",
      ],
      [
        "5",
        "Walker-Williamson",
        "Team-Oriented 6Thgeneration Matrix",
        "in-progress",
      ],
      ["6", "Boehm and Sons", "Automated Systematic Paradigm", "backlog"],
      [
        "7",
        "Runolfsson, Hegmann and Block",
        "Integrated Transitional Strategy",
        "backlog",
      ],
      ["8", "Schumm-Labadie", "Operative Heuristic Challenge", "backlog"],
      [
        "9",
        "Kohler Group",
        "Re-Contextualized Multi-Tasking Attitude",
        "backlog",
      ],
      ["10", "Romaguera Inc", "Managed Foreground Toolset", "backlog"],
      ["11", "Reilly-King", "Future-Proofed Interactive Toolset", "complete"],
      [
        "12",
        "Emard, Champlin and Runolfsdottir",
        "Devolved Needs-Based Capability",
        "backlog",
      ],
      [
        "13",
        "Fritsch, Cronin and Wolff",
        "Open-Source 3Rdgeneration Website",
        "complete",
      ],
      [
        "14",
        "Borer LLC",
        "Profit-Focused Incremental Orchestration",
        "backlog",
      ],
      [
        "15",
        "Emmerich-Ankunding",
        "User-Centric Stable Extranet",
        "in-progress",
      ],
      [
        "16",
        "Willms-Abbott",
        "Progressive Bandwidth-Monitored Access",
        "in-progress",
      ],
      ["17", "Brekke PLC", "Intuitive User-Facing Customerloyalty", "complete"],
      [
        "18",
        "Bins, Toy and Klocko",
        "Integrated Assymetric Software",
        "backlog",
      ],
      [
        "19",
        "Hodkiewicz-Hayes",
        "Programmable Systematic Securedline",
        "backlog",
      ],
      ["20", "Murphy, Lang and Ferry", "Organized Explicit Access", "backlog"],
    ].map((companyDetails) => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }
  renderSwimlane(name, clients, ref, id) {
    return <Swimlane name={name} clients={clients} dragulaRef={ref} id={id} />;
  }

  componentDidMount() {
    const containers = Object.values(this.swimlanes); // get container refs
    this.drake = Dragula(containers.map((container) => container.current), {
      copy: false,
    });
    this.drake.on("drop", (el, target, source, sibling) => {
      this.drake.cancel(true); // cancel external DOM update, must update with corresponding state
      this.moveClient(el, target, sibling);
      console.log(this.state);
    });
  }

  // method to move a client and update status
  moveClient(el, target, sibling) {
    const targetLane = target.getAttribute("id"); //get target lane

    //temp array to hold all clients
    const temp = [
      ...this.state.clients.backlog,
      ...this.state.clients.inProgress,
      ...this.state.clients.complete,
    ];

    const element = temp.find(
      (client) => client.id === el.getAttribute("data-id")
    ); //find client to move
    const elementClone = { ...element, status: targetLane }; //clone client to move

    //remove client from temp array
    const newTemp = temp.filter((client) => client.id !== element.id);

    //add client to new array in front of sibling element
    if (!sibling) {
      newTemp.push(elementClone);
    } else {
      const siblingIndex = newTemp.findIndex(
        (client) => client.id === sibling.getAttribute("data-id")
      );
      newTemp.splice(siblingIndex, 0, elementClone);
    }

    //update state with new array
    this.setState({
      clients: {
        backlog: newTemp.filter(
          (client) => !client.status || client.status === "backlog"
        ),
        inProgress: newTemp.filter(
          (client) => client.status && client.status === "in-progress"
        ),
        complete: newTemp.filter(
          (client) => client.status && client.status === "complete"
        ),
      },
    });
  }
  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane(
                "Backlog",
                this.state.clients.backlog,
                this.swimlanes.backlog,
                "backlog"
              )}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane(
                "In Progress",
                this.state.clients.inProgress,
                this.swimlanes.inProgress,
                "in-progress"
              )}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane(
                "Complete",
                this.state.clients.complete,
                this.swimlanes.complete,
                "complete"
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
