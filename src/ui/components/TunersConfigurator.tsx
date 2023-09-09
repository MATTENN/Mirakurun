/*
   Copyright 2020 kanreisa

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
import EventEmitter from "eventemitter3";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
    Stack,
    Spinner,
    SpinnerSize,
    DetailsList,
    Selection,
    SelectionMode,
    IColumn,
    Dropdown,
    PrimaryButton,
    DefaultButton,
    Toggle,
    Dialog,
    DialogType,
    DialogFooter,
    TextField,
    Checkbox,
    IconButton,
    ActionButton
} from "@fluentui/react";
import { UIState } from "../index";
import { ConfigTuners, ChannelType } from "../../../api";

const configAPI = "/api/config/tuners";

interface Item {
    key: string;
    enable: JSX.Element;
    name: JSX.Element;
    types: JSX.Element;
    options: JSX.Element;
    controls: JSX.Element;
}

const columns: IColumn[] = [
    {
        key: "col-enable",
        name: "Enable",
        fieldName: "enable",
        minWidth: 44,
        maxWidth: 44
    },
    {
        key: "col-name",
        name: "Name",
        fieldName: "name",
        minWidth: 0,
        maxWidth: 70
    },
    {
        key: "col-types",
        name: "Types",
        fieldName: "types",
        minWidth: 60,
        maxWidth: 105
    },
    {
        key: "col-options",
        name: "Options",
        fieldName: "options",
        minWidth: 340,
        // maxWidth: 400
    },
    {
        key: "col-controls",
        name: "",
        fieldName: "controls",
        minWidth: 120,
        maxWidth: 120
    }
];

const dummySelection = new Selection(); // dummy

const typesIndex = ["GR", "BS", "CS", "SKY", "NW1", "NW2", "NW3", "NW4", "NW5", "NW6", "NW7", "NW8", "NW9", "NW10",
                    "NW11", "NW12", "NW13", "NW14", "NW15", "NW16", "NW17", "NW18", "NW19", "NW20",
                    "NW21", "NW22", "NW23", "NW24", "NW25", "NW26", "NW27", "NW28", "NW29", "NW30",
                    "NW31", "NW32", "NW33", "NW34", "NW35", "NW36", "NW37", "NW38", "NW39", "NW40"];
function sortTypes(types: ChannelType[]): ChannelType[] {
    return types.sort((a, b) => typesIndex.indexOf(a) - typesIndex.indexOf(b));
}

const Configurator: React.FC<{ uiState: UIState, uiStateEvents: EventEmitter }> = ({ uiState, uiStateEvents }) => {

    const [current, setCurrent] = useState<ConfigTuners>(null);
    const [editing, setEditing] = useState<ConfigTuners>(null);
    const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false);
    const [saved, setSaved] = useState<boolean>(false);
    const listContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (saved === true) {
            setTimeout(() => {
                uiStateEvents.emit("notify:restart-required");
            }, 500);
            setSaved(false);
            return;
        }
        (async () => {
            try {
                const res = await (await fetch(configAPI)).json();
                console.log("TunersConfigurator", "GET", configAPI, "->", res);
                setEditing(JSON.parse(JSON.stringify(res)));
                setCurrent(JSON.parse(JSON.stringify(res)));
            } catch (e) {
                console.error(e);
            }
        })();
    }, [saved]);

    const items = [];
    editing?.forEach((tuner, i) => {
        const item: Item = {
            key: `item${i}`,
            enable: (
                <Toggle
                    checked={!tuner.isDisabled}
                    onChange={(ev, checked) => {
                        tuner.isDisabled = !checked;
                        setEditing([...editing]);
                    }}
                    style={{ marginTop: 6 }}
                />
            ),
            name: (
                <TextField
                    value={tuner.name}
                    onChange={(ev, newValue) => {
                        tuner.name = newValue;
                        setEditing([...editing]);
                    }}
                />
            ),
            types: (
                <Dropdown
                    styles={{ root: { display: "inline-block", minWidth: 70 } }}
                    multiSelect
                    options={[
                        { key: "GR", text: "GR" },
                        { key: "BS", text: "BS" },
                        { key: "CS", text: "CS" },
                        { key: "SKY", text: "SKY" },
                        { key: "NW1", text: "NW1" },
                        { key: "NW2", text: "NW2" },
                        { key: "NW3", text: "NW3" },
                        { key: "NW4", text: "NW4" },
                        { key: "NW5", text: "NW5" },
                        { key: "NW6", text: "NW6" },
                        { key: "NW7", text: "NW7" },
                        { key: "NW8", text: "NW8" },
                        { key: "NW9", text: "NW9" },
                        { key: "NW10", text: "NW10" },
                        { key: "NW11", text: "NW11" },
                        { key: "NW12", text: "NW12" },
                        { key: "NW13", text: "NW13" },
                        { key: "NW14", text: "NW14" },
                        { key: "NW15", text: "NW15" },
                        { key: "NW16", text: "NW16" },
                        { key: "NW17", text: "NW17" },
                        { key: "NW18", text: "NW18" },
                        { key: "NW19", text: "NW19" },
                        { key: "NW20", text: "NW20" },
                        { key: "NW21", text: "NW21" },
                        { key: "NW22", text: "NW22" },
                        { key: "NW23", text: "NW23" },
                        { key: "NW24", text: "NW24" },
                        { key: "NW25", text: "NW25" },
                        { key: "NW26", text: "NW26" },
                        { key: "NW27", text: "NW27" },
                        { key: "NW28", text: "NW28" },
                        { key: "NW29", text: "NW29" },
                        { key: "NW30", text: "NW30" },
                        { key: "NW31", text: "NW31" },
                        { key: "NW32", text: "NW32" },
                        { key: "NW33", text: "NW33" },
                        { key: "NW34", text: "NW34" },
                        { key: "NW35", text: "NW35" },
                        { key: "NW36", text: "NW36" },
                        { key: "NW37", text: "NW37" },
                        { key: "NW38", text: "NW38" },
                        { key: "NW39", text: "NW39" },
                        { key: "NW40", text: "NW40" }
                    ]}
                    selectedKeys={tuner.types}
                    onChange={(ev, option) => {
                        if (option.selected === true) {
                            tuner.types.push(option.key as any);
                            tuner.types = sortTypes(tuner.types);
                        } else {
                            tuner.types = tuner.types.filter(type => type !== option.key);
                        }
                        setEditing([...editing]);
                    }}
                />
            ),
            options: (
                <Stack tokens={{ childrenGap: "8 0" }}>
                    {!tuner.remoteMirakurunHost && (
                        <>
                            <TextField
                                label="Command:"
                                value={tuner.command || ""}
                                onChange={(ev, newValue) => {
                                    if (newValue === "") {
                                        delete tuner.command;
                                    } else {
                                        tuner.command = newValue;
                                    }
                                    setEditing([...editing]);
                                }}
                            />
                            <TextField
                                label="DVB Device Path:"
                                value={tuner.dvbDevicePath || ""}
                                onChange={(ev, newValue) => {
                                    if (newValue === "") {
                                        delete tuner.dvbDevicePath;
                                    } else {
                                        tuner.dvbDevicePath = newValue;
                                    }
                                    setEditing([...editing]);
                                }}
                            />
                        </>
                    )}
                    {!tuner.command && (
                        <Stack horizontal tokens={{ childrenGap: "0 8" }}>
                            <TextField
                                label="Remote Mirakurun Host:"
                                value={tuner.remoteMirakurunHost || ""}
                                onChange={(ev, newValue) => {
                                    if (newValue === "") {
                                        delete tuner.remoteMirakurunHost;
                                    } else if (/^[0-9a-z\.]+$/.test(newValue)) {
                                        tuner.remoteMirakurunHost = newValue;
                                    }
                                    setEditing([...editing]);
                                }}
                            />
                            <TextField
                                style={{ width: 55 }}
                                label="Port:"
                                placeholder="40772"
                                value={`${tuner.remoteMirakurunPort || ""}`}
                                onChange={(ev, newValue) => {
                                    if (newValue === "") {
                                        delete tuner.remoteMirakurunPort;
                                    } else if (/^[0-9]+$/.test(newValue)) {
                                        const port = parseInt(newValue, 10);
                                        if (port <= 65535 && port > 0) {
                                            tuner.remoteMirakurunPort = port;
                                        }
                                    }
                                    setEditing([...editing]);
                                }}
                            />
                            <Checkbox
                                styles={{ root: { marginTop: 34 } }}
                                label="Decode"
                                checked={tuner.remoteMirakurunDecoder || false}
                                onChange={(ev, checked) => {
                                    if (checked) {
                                        tuner.remoteMirakurunDecoder = true;
                                    } else {
                                        delete tuner.remoteMirakurunDecoder;
                                    }
                                    setEditing([...editing]);
                                }}
                            />
                        </Stack>
                    )}
                    {(!tuner.remoteMirakurunHost || !tuner.remoteMirakurunDecoder) && (
                        <TextField
                            label="Decoder:"
                            value={tuner.decoder || ""}
                            onChange={(ev, newValue) => {
                                if (newValue === "") {
                                    delete tuner.decoder;
                                } else {
                                    tuner.decoder = newValue;
                                }
                                setEditing([...editing]);
                            }}
                        />
                    )}
                </Stack>
            ),
            controls: (
                <Stack horizontal horizontalAlign="end">
                    <IconButton
                        disabled={i === 0}
                        style={{ opacity: i === 0 ? 0 : 1 }}
                        title="Up"
                        iconProps={{ iconName: "Up" }}
                        onClick={() => {
                            editing.splice(i, 1);
                            editing.splice(i - 1, 0, tuner);
                            setEditing([...editing]);
                        }}
                    />
                    <IconButton
                        disabled={i === editing.length - 1}
                        style={{ opacity: i === editing.length - 1 ? 0 : 1 }}
                        title="Down"
                        iconProps={{ iconName: "Down" }}
                        onClick={() => {
                            editing.splice(i, 1);
                            editing.splice(i + 1, 0, tuner);
                            setEditing([...editing]);
                        }}
                    />
                    <IconButton
                        title="Controls"
                        iconProps={{ iconName: "More" }}
                        menuProps={{ items: [{
                            key: "remove",
                            text: "Remove Tuner",
                            iconProps: { iconName: "Delete" },
                            onClick: () => {
                                editing.splice(i, 1);
                                setEditing([...editing]);
                            }
                        }] }}
                    />
                </Stack>
            )
        };
        //
        items.push(item);
    });

    const changed = JSON.stringify(current) !== JSON.stringify(editing);

    if (listContainerRef.current) {
        listContainerRef.current.style.maxHeight = "calc(100vh - 410px)";
    }

    return (
        <>
            {!current && <Spinner size={SpinnerSize.large} />}
            {editing &&
                <Stack tokens={{ childrenGap: "8 0" }}>
                    <Stack.Item>
                        <ActionButton
                            text="Add Tuner"
                            iconProps={{ iconName: "Add" }}
                            onClick={() => {
                                const i = editing.length;
                                editing.push({
                                    name: `adapter${i}`,
                                    types: [],
                                    command: `dvbv5-zap -a ${i} -c ./config/dvbconf-for-isdb/conf/dvbv5_channels_isdbs.conf -r -P <channel>`,
                                    dvbDevicePath: `/dev/dvb/adapter${i}/dvr0`,
                                    decoder: "arib-b25-stream-test",
                                    isDisabled: true
                                });
                                setEditing([...editing]);
                                setTimeout(() => {
                                    listContainerRef.current.scrollTop = listContainerRef.current.scrollHeight;
                                }, 0);
                            }}
                        />
                    </Stack.Item>

                    <div ref={listContainerRef} style={{ overflowY: "scroll" }}>
                        <DetailsList
                            setKey="items"
                            items={items}
                            columns={columns}
                            selection={dummySelection}
                            selectionMode={SelectionMode.none}
                        />
                    </div>

                    <Stack horizontal tokens={{ childrenGap: "0 8" }} style={{ marginTop: 16 }}>
                        <PrimaryButton text="Save" disabled={!changed} onClick={() => setShowSaveDialog(true)} />
                        <DefaultButton text="Cancel" disabled={!changed} onClick={() => setEditing(JSON.parse(JSON.stringify(current)))} />
                    </Stack>
                </Stack>
            }
            <Dialog
                hidden={!showSaveDialog}
                onDismiss={() => setShowSaveDialog(false)}
                dialogContentProps={{
                    type: DialogType.largeHeader,
                    title: "Save",
                    subText: "Restart is required to apply configuration."
                }}
            >
                <DialogFooter>
                    <PrimaryButton
                        text="Save"
                        onClick={() => {
                            setShowSaveDialog(false);
                            (async () => {
                                console.log("TunersConfigurator", "PUT", configAPI, "<-", editing);
                                await fetch(configAPI, {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json; charset=utf-8" },
                                    body: JSON.stringify(editing)
                                });
                                setSaved(true);
                            })();
                        }}
                    />
                    <DefaultButton
                        text="Cancel"
                        onClick={() => setShowSaveDialog(false)}
                    />
                </DialogFooter>
            </Dialog>
        </>
    );
};

export default Configurator;
