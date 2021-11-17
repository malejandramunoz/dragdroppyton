import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import uuid from 'uuid/v4';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Tab, Tabs, TabList, TabPanel} from "react-tabs";
import 'react-tabs/style/react-tabs.css';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};
/**
 * Moves an item from one list to another list.
 */
const copy = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const item = sourceClone[droppableSource.index];

    destClone.splice(droppableDestination.index, 0, { ...item, id: uuid() });
    return destClone;
};

const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;

const Content = styled.div`
  margin-right: 200px;
`;

const Item = styled.div`
  display: flex;
  user-select: none;
  padding: 0.5rem;
  margin: 0 0  0.5rem 0;
  align-items: flex-start;
  align-content: flex-start;
  line-height: 1.5;
  border-radius: 3px;
  background: #ffff;
  border: 1px ${props => (props.isDragging ? 'dashed #000' : 'solid #ddd')};
 `;

const Clone = styled(Item)`
  + div {
    background: inherit
  }
`;

const Handle = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  user-select: none;
  margin: -0.5rem 0.5rem -0.5rem -0.5rem;
  padding: 0.5rem;
  line-height: 1.5;
  border-radius: 3px 0 0 3px;
  background: #fff;
  border-right: 1px solid #ddd;
  color: #000;
`;

const List = styled.div`
  border: 1px ${props => (props.isDraggingOver ? 'dashed #000' : 'solid #ddd')};
  background: #fff;
  padding: 0.5rem 0.5rem 0;
  border-radius: 3px;
  flex: 0 0 150px;
  font-family: sans-serif;
`;

const Kiosk = styled(List)`
  position: absolute;
  top: 32px;
  right: 0;
  bottom: 0;
  width: 200px;
`;

const Container = styled(List)`
  margin: 0.5rem 0.5rem 1.5rem;
`;

const Notice = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  padding: 0.5rem;
  margin: 0 0.5rem 0.5rem;
  border: 1px solid transparent;
  line-height: 1.5;
  color: #aaa;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  margin: 0.5rem;
  padding: 0.5rem;
  color: #000;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 3px;
  font-size: 1rem;
  cursor: pointer;
`;

const ButtonText = styled.div`
  margin: 0 1rem;
`;

const LOGIC = [
    {
        id: uuid(),
        content: 'And',
        color: "#B98B73"
    },
    {
        id: uuid(),
        content: 'Or',
        color: "#B98B73"
    },
    {
        id: uuid(),
        content: 'Not',
        color: "#B98B73"
    },
    {
        id: uuid(),
        content: '<',
        color: "#B98B73"
    },
    {
        id: uuid(),
        content: '>',
        color: "#B98B73"
    },
    {
        id: uuid(),
        content: '=',
        color: "#B98B73"
    },
    {
        id: uuid(),
        content: '<=',
        color: "#B98B73"
    },
    {
        id: uuid(),
        content: '>=',
        color: "#B98B73"
    },
    {
        id: uuid(),
        content: 'if/else',
        color: "#B98B73"
    },
    {
        id: uuid(),
        content: 'if/elseif/else',
        color: "#B98B73"
    }

];

const LOOPS = [
    {
        id: uuid(),
        content: 'For',
        color: "#CB997E"
    },
    {
        id: uuid(),
        content: 'For Each',
        color: "#CB997E"
    },
    {
        id: uuid(),
        content: 'While',
        color: "#CB997E"
    }
];

const TEXT = [
    {
        id: uuid(),
        content: 'Input',
        color: "#DDBEA9"
    }
];

// Text, Math, Variables

const MATH = [
    {
        id: uuid(),
        content: '+',
        color: "#FFE8D6"
    },
    {
        id: uuid(),
        content: '-',
        color: "#FFE8D6"
    },
    {
        id: uuid(),
        content: '*',
        color: "#FFE8D6"
    },
    {
        id: uuid(),
        content: '/',
        color: "#FFE8D6"
    },
    {
        id: uuid(),
        content: 'Input',
        color: "#FFE8D6"
    }
];

const VARIABLES = [
    {
        id: uuid(),
        content: 'global',
        color: "#D4C7B0"
    },
    {
        id: uuid(),
        content: 'local',
        color: "#D4C7B0"
    },
    {
        id: uuid(),
        content: 'get',
        color: "#D4C7B0"
    },
    {
        id: uuid(),
        content: 'set',
        color: "#D4C7B0"
    }
];

const MISC = [
    {
        id: uuid(),
        content: 'print',
        color: "#B7B7A4"
    }
]

class App extends Component {
    state = {
        [uuid()]: []
    };

    insideList = {
        [uuid()] :[]
    }

    onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        switch (source.droppableId) {
            case destination.droppableId:
                this.setState({
                    [destination.droppableId]: reorder(
                        this.state[source.droppableId],
                        source.index,
                        destination.index
                    )
                });
                break;
            case 'LOGIC':
                this.setState({
                    [destination.droppableId]: copy(
                        LOGIC,
                        this.state[destination.droppableId],
                        source,
                        destination
                    )
                });
                break;
            case 'LOOPS':
                this.setState({
                    [destination.droppableId]: copy(
                        LOOPS,
                        this.state[destination.droppableId],
                        source,
                        destination
                    )
                });
                break;
            case 'TEXT':
                this.setState({
                    [destination.droppableId]: copy(
                        TEXT,
                        this.state[destination.droppableId],
                        source,
                        destination
                    )
                });
                break;
            case 'MATH':
                this.setState({
                    [destination.droppableId]: copy(
                        MATH,
                        this.state[destination.droppableId],
                        source,
                        destination
                    )
                });
                break;
            case 'VARIABLES':
                this.setState({
                    [destination.droppableId]: copy(
                        VARIABLES,
                        this.state[destination.droppableId],
                        source,
                        destination
                    )
                });
                break;
            case 'MISC':
                this.setState({
                    [destination.droppableId]: copy(
                        MISC,
                        this.state[destination.droppableId],
                        source,
                        destination
                    )
                });
                break;
            default:
                this.setState(
                    move(
                        this.state[source.droppableId],
                        this.state[destination.droppableId],
                        source,
                        destination
                    )
                );
                break;
        }
    };

    addList = e => {
        this.setState({ [uuid()]: [] });
    };

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Tabs>
                    <TabList style={{
                        display: "flex",
                        justifyContent: "flex-end"
                    }}>
                        <Tab>Logic</Tab>
                        <Tab>Loops</Tab>
                        <Tab>Text</Tab>
                        <Tab>Math</Tab>
                        <Tab>Variables</Tab>
                        <Tab>Misc</Tab>
                    </TabList>
                    <TabPanel>
                        <Droppable droppableId="LOGIC" isDropDisabled={true}>
                            {(provided, snapshot) => (
                                <Kiosk
                                    innerRef={provided.innerRef}
                                    isDraggingOver={snapshot.isDraggingOver}>
                                    {LOGIC.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}>
                                            {(provided, snapshot) => (
                                                <React.Fragment>
                                                    <Item
                                                        innerRef={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        isDragging={snapshot.isDragging}
                                                        style={
                                                            provided.draggableProps
                                                                .style
                                                        }
                                                        style={{
                                                            background: "#B98B73"
                                                        }}
                                                    >
                                                        {item.content}
                                                    </Item>
                                                    {snapshot.isDragging && (
                                                        <Clone>{item.content}</Clone>
                                                    )}
                                                </React.Fragment>
                                            )}
                                        </Draggable>
                                    ))}
                                </Kiosk>
                            )}
                        </Droppable>
                    </TabPanel>
                    <TabPanel>
                        <Droppable droppableId="LOOPS" isDropDisabled={true}>
                            {(provided, snapshot) => (
                                <Kiosk
                                    innerRef={provided.innerRef}
                                    isDraggingOver={snapshot.isDraggingOver}>
                                    {LOOPS.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}>
                                            {(provided, snapshot) => (
                                                <React.Fragment>
                                                    <Item
                                                        innerRef={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        isDragging={snapshot.isDragging}
                                                        style={
                                                            provided.draggableProps
                                                                .style
                                                        }
                                                        style={{
                                                            background: "#CB997E"
                                                        }}
                                                    >
                                                        {item.content}
                                                    </Item>
                                                    {snapshot.isDragging && (
                                                        <Clone>{item.content}</Clone>
                                                    )}
                                                </React.Fragment>
                                            )}
                                        </Draggable>
                                    ))}
                                </Kiosk>
                            )}
                        </Droppable>
                    </TabPanel>
                    <TabPanel>
                        <Droppable droppableId="TEXT" isDropDisabled={true}>
                            {(provided, snapshot) => (
                                <Kiosk
                                    innerRef={provided.innerRef}
                                    isDraggingOver={snapshot.isDraggingOver}>
                                    {TEXT.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}>
                                            {(provided, snapshot) => (
                                                <React.Fragment>
                                                    <Item
                                                        innerRef={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        isDragging={snapshot.isDragging}
                                                        style={
                                                            provided.draggableProps
                                                                .style
                                                        }
                                                        style={{
                                                            background: "#DDBEA9"
                                                        }}
                                                    >
                                                        {item.content}
                                                    </Item>
                                                    {snapshot.isDragging && (
                                                        <Clone>{item.content}</Clone>
                                                    )}
                                                </React.Fragment>
                                            )}
                                        </Draggable>
                                    ))}
                                </Kiosk>
                            )}
                        </Droppable>
                    </TabPanel>
                    <TabPanel>
                        <Droppable droppableId="MATH" isDropDisabled={true}>
                            {(provided, snapshot) => (
                                <Kiosk
                                    innerRef={provided.innerRef}
                                    isDraggingOver={snapshot.isDraggingOver}>
                                    {MATH.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}>
                                            {(provided, snapshot) => (
                                                <React.Fragment>
                                                    <Item
                                                        innerRef={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        isDragging={snapshot.isDragging}
                                                        style={
                                                            provided.draggableProps
                                                                .style
                                                        }
                                                        style={{
                                                            background: "#FFE8D6"
                                                        }}
                                                    >
                                                        {item.content}
                                                    </Item>
                                                    {snapshot.isDragging && (
                                                        <Clone>{item.content}</Clone>
                                                    )}
                                                </React.Fragment>
                                            )}
                                        </Draggable>
                                    ))}
                                </Kiosk>
                            )}
                        </Droppable>
                    </TabPanel>
                    <TabPanel>
                        <Droppable droppableId="VARIABLES" isDropDisabled={true}>
                            {(provided, snapshot) => (
                                <Kiosk
                                    innerRef={provided.innerRef}
                                    isDraggingOver={snapshot.isDraggingOver}>
                                    {VARIABLES.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}>
                                            {(provided, snapshot) => (
                                                <React.Fragment>
                                                    <Item
                                                        innerRef={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        isDragging={snapshot.isDragging}
                                                        style={
                                                            provided.draggableProps
                                                                .style
                                                        }
                                                        style={{
                                                            background: "#D4C7B0"
                                                        }}
                                                    >
                                                        {item.content}
                                                    </Item>
                                                    {snapshot.isDragging && (
                                                        <Clone>{item.content}</Clone>
                                                    )}
                                                </React.Fragment>
                                            )}
                                        </Draggable>
                                    ))}
                                </Kiosk>
                            )}
                        </Droppable>
                    </TabPanel>
                    <TabPanel>
                            <Droppable droppableId="MISC" isDropDisabled={true}>
                            {(provided, snapshot) => (
                                <Kiosk
                                    innerRef={provided.innerRef}
                                    isDraggingOver={snapshot.isDraggingOver}>
                                    {MISC.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}>
                                            {(provided, snapshot) => (
                                                <React.Fragment>
                                                    <Item
                                                        innerRef={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        isDragging={snapshot.isDragging}
                                                        style={
                                                            provided.draggableProps
                                                                .style
                                                        }
                                                        style={{
                                                            background: "#B7B7A4"
                                                        }}
                                                    >
                                                        {item.content}
                                                    </Item>
                                                    {snapshot.isDragging && (
                                                        <Clone>{item.content}</Clone>
                                                    )}
                                                </React.Fragment>
                                            )}
                                        </Draggable>
                                    ))}
                                </Kiosk>
                            )}
                        </Droppable>
                    </TabPanel>
                </Tabs>

                <Content>
                    <Button onClick={this.addList}>
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                            />
                        </svg>
                        <ButtonText>Add Code Snippet</ButtonText>
                    </Button>
                    {Object.keys(this.state).map((list, i) => (
                        <Droppable key={list} droppableId={list}>
                            {(provided, snapshot) => (
                                <Container
                                    innerRef={provided.innerRef}
                                    isDraggingOver={snapshot.isDraggingOver}>
                                    {this.state[list].length
                                        ? this.state[list].map(
                                              (item, index) => (
                                                  <Draggable
                                                      key={item.id}
                                                      draggableId={item.id}
                                                      index={index}>
                                                      {(provided, snapshot) => (
                                                          (item.color === "#B98B73" &&
                                                          <Item
                                                              innerRef={
                                                                  provided.innerRef
                                                              }
                                                              {...provided.draggableProps}
                                                              isDragging={
                                                                  snapshot.isDragging
                                                              }
                                                              style={
                                                                  provided
                                                                      .draggableProps
                                                                      .style
                                                              }
                                                              style={{
                                                                  display: "flex",
                                                                  justifyContent: "space-between",
                                                                  background: '#B98B73'
                                                              }}
                                                          >

                                                              <Handle
                                                                  {...provided.dragHandleProps}>
                                                                  <svg
                                                                      width="24"
                                                                      height="24"
                                                                      viewBox="0 0 24 24">
                                                                      <path
                                                                          fill="currentColor"
                                                                          d="M3,15H21V13H3V15M3,19H21V17H3V19M3,11H21V9H3V11M3,5V7H21V5H3Z"
                                                                      />
                                                                  </svg>
                                                              </Handle>
                                                              {Object.keys(this.insideList).map((insideList, i) => (
                                                                  <Droppable key={insideList} droppableId ={insideList}>
                                                                      {(insideProvided, insideSnapshot) => (
                                                                          <Container innerRef={insideProvided.innerRef} isDraggingOver={insideSnapshot.isDraggingOver}>
                                                                              {this.insideList[insideList].length
                                                                                  ? this.insideList[insideList].map(
                                                                                      (insideItem, insideIndex) => (
                                                                                          <Draggable key={insideItem.index} draggableId={insideItem.id} index={insideIndex}>
                                                                                              {(insideP, insideS) => (
                                                                                                  <Item innerRef={insideP.innerRef} {...insideP.draggableProps} isDragging={insideS.isDragging} style={insideP.draggableProps .style}>
                                                                                                      <Handle
                                                                                                          {...provided.dragHandleProps}>
                                                                                                          <svg
                                                                                                              width="24"
                                                                                                              height="24"
                                                                                                              viewBox="0 0 24 24">
                                                                                                              <path
                                                                                                                  fill="currentColor"
                                                                                                                  d="M3,15H21V13H3V15M3,19H21V17H3V19M3,11H21V9H3V11M3,5V7H21V5H3Z"
                                                                                                              />
                                                                                                          </svg>
                                                                                                      </Handle>
                                                                                                      {insideItem.content}
                                                                                                  </Item>
                                                                                              )}
                                                                                          </Draggable>
                                                                                      )
                                                                                  ) : !provided.placeholder && (
                                                                                  <Notice>Drop</Notice>
                                                                              )}
                                                                          </Container>
                                                                      )}
                                                                  </Droppable>
                                                              ))}
                                                                  {item.content}
                                                                  <button
                                                                      style={{
                                                                          align: "right"
                                                                      }}
                                                                      onClick={() => {
                                                                          const newState = this.state;
                                                                          newState[list].splice(index, 1);
                                                                          this.setState(newState);
                                                                      }}
                                                                  >
                                                                      Delete
                                                                  </button>
                                                          </Item>
                                                          ) || ( item.color === "#CB997E" &&
                                                              <Item
                                                                  innerRef={
                                                                      provided.innerRef
                                                                  }
                                                                  {...provided.draggableProps}
                                                                  isDragging={
                                                                      snapshot.isDragging
                                                                  }
                                                                  style={
                                                                      provided
                                                                          .draggableProps
                                                                          .style
                                                                  }
                                                                  style={{
                                                                      display: "flex",
                                                                      justifyContent: "space-between",
                                                                      background: "#CB997E"
                                                                  }}
                                                              >

                                                                  <Handle
                                                                      {...provided.dragHandleProps}>
                                                                      <svg
                                                                          width="24"
                                                                          height="24"
                                                                          viewBox="0 0 24 24">
                                                                          <path
                                                                              fill="currentColor"
                                                                              d="M3,15H21V13H3V15M3,19H21V17H3V19M3,11H21V9H3V11M3,5V7H21V5H3Z"
                                                                          />
                                                                      </svg>
                                                                  </Handle>
                                                                  {item.content}
                                                                  <button
                                                                      style={{
                                                                          align: "right"
                                                                      }}
                                                                      onClick={() => {
                                                                          const newState = this.state;
                                                                          newState[list].splice(index, 1);
                                                                          this.setState(newState);
                                                                      }}
                                                                  >
                                                                      Delete
                                                                  </button>
                                                              </Item>
                                                          ) || ( item.color === "#DDBEA9" &&
                                                              <Item
                                                                  innerRef={
                                                                      provided.innerRef
                                                                  }
                                                                  {...provided.draggableProps}
                                                                  isDragging={
                                                                      snapshot.isDragging
                                                                  }
                                                                  style={
                                                                      provided
                                                                          .draggableProps
                                                                          .style
                                                                  }
                                                                  style={{
                                                                      display: "flex",
                                                                      justifyContent: "space-between",
                                                                      background: "#DDBEA9"
                                                                  }}
                                                              >

                                                                  <Handle
                                                                      {...provided.dragHandleProps}>
                                                                      <svg
                                                                          width="24"
                                                                          height="24"
                                                                          viewBox="0 0 24 24">
                                                                          <path
                                                                              fill="currentColor"
                                                                              d="M3,15H21V13H3V15M3,19H21V17H3V19M3,11H21V9H3V11M3,5V7H21V5H3Z"
                                                                          />
                                                                      </svg>
                                                                  </Handle>
                                                                  {item.content}
                                                                  <button
                                                                      style={{
                                                                          align: "right"
                                                                      }}
                                                                      onClick={() => {
                                                                          const newState = this.state;
                                                                          newState[list].splice(index, 1);
                                                                          this.setState(newState);
                                                                      }}
                                                                  >
                                                                      Delete
                                                                  </button>
                                                              </Item>
                                                          ) || ( item.color === "#FFE8D6" &&
                                                              <Item
                                                                  innerRef={
                                                                      provided.innerRef
                                                                  }
                                                                  {...provided.draggableProps}
                                                                  isDragging={
                                                                      snapshot.isDragging
                                                                  }
                                                                  style={
                                                                      provided
                                                                          .draggableProps
                                                                          .style
                                                                  }
                                                                  style={{
                                                                      display: "flex",
                                                                      justifyContent: "space-between",
                                                                      background: "#FFE8D6"
                                                                  }}
                                                              >

                                                                  <Handle
                                                                      {...provided.dragHandleProps}>
                                                                      <svg
                                                                          width="24"
                                                                          height="24"
                                                                          viewBox="0 0 24 24">
                                                                          <path
                                                                              fill="currentColor"
                                                                              d="M3,15H21V13H3V15M3,19H21V17H3V19M3,11H21V9H3V11M3,5V7H21V5H3Z"
                                                                          />
                                                                      </svg>
                                                                  </Handle>
                                                                  {item.content}
                                                                  <button
                                                                      style={{
                                                                          align: "right"
                                                                      }}
                                                                      onClick={() => {
                                                                          const newState = this.state;
                                                                          newState[list].splice(index, 1);
                                                                          this.setState(newState);
                                                                      }}
                                                                  >
                                                                      Delete
                                                                  </button>
                                                              </Item>
                                                          ) || ( item.color === "#D4C7B0" &&
                                                              <Item
                                                                  innerRef={
                                                                      provided.innerRef
                                                                  }
                                                                  {...provided.draggableProps}
                                                                  isDragging={
                                                                      snapshot.isDragging
                                                                  }
                                                                  style={
                                                                      provided
                                                                          .draggableProps
                                                                          .style
                                                                  }
                                                                  style={{
                                                                      display: "flex",
                                                                      justifyContent: "space-between",
                                                                      background: "#D4C7B0"
                                                                  }}
                                                              >

                                                                  <Handle
                                                                      {...provided.dragHandleProps}>
                                                                      <svg
                                                                          width="24"
                                                                          height="24"
                                                                          viewBox="0 0 24 24">
                                                                          <path
                                                                              fill="currentColor"
                                                                              d="M3,15H21V13H3V15M3,19H21V17H3V19M3,11H21V9H3V11M3,5V7H21V5H3Z"
                                                                          />
                                                                      </svg>
                                                                  </Handle>
                                                                  {item.content}
                                                                  <button
                                                                      style={{
                                                                          align: "right"
                                                                      }}
                                                                      onClick={() => {
                                                                          const newState = this.state;
                                                                          newState[list].splice(index, 1);
                                                                          this.setState(newState);
                                                                      }}
                                                                  >
                                                                      Delete
                                                                  </button>
                                                              </Item>
                                                          ) || ( item.color === "#B7B7A4" &&
                                                              <Item
                                                                  innerRef={
                                                                      provided.innerRef
                                                                  }
                                                                  {...provided.draggableProps}
                                                                  isDragging={
                                                                      snapshot.isDragging
                                                                  }
                                                                  style={
                                                                      provided
                                                                          .draggableProps
                                                                          .style
                                                                  }
                                                                  style={{
                                                                      display: "flex",
                                                                      justifyContent: "space-between",
                                                                      background: "#B7B7A4"
                                                                  }}
                                                              >

                                                                  <Handle
                                                                      {...provided.dragHandleProps}>
                                                                      <svg
                                                                          width="24"
                                                                          height="24"
                                                                          viewBox="0 0 24 24">
                                                                          <path
                                                                              fill="currentColor"
                                                                              d="M3,15H21V13H3V15M3,19H21V17H3V19M3,11H21V9H3V11M3,5V7H21V5H3Z"
                                                                          />
                                                                      </svg>
                                                                  </Handle>
                                                                  {item.content}
                                                                  <button
                                                                      style={{
                                                                          align: "right"
                                                                      }}
                                                                      onClick={() => {
                                                                          const newState = this.state;
                                                                          newState[list].splice(index, 1);
                                                                          this.setState(newState);
                                                                      }}
                                                                  >
                                                                      Delete
                                                                  </button>
                                                              </Item>
                                                          )

                                                      )}
                                                  </Draggable>
                                              )
                                          )
                                        : !provided.placeholder && (
                                              <Notice>Drop code here</Notice>
                                          )}
                                    {provided.placeholder}
                                </Container>
                            )}
                        </Droppable>
                    ))}
                </Content>
            </DragDropContext>
        );
    }
}

// Put the things into the DOM!
ReactDOM.render(<App />, document.getElementById('root'));
