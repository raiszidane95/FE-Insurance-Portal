import React from "react";
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";

export function TabsKunjungan() {
  const [activeTab, setActiveTab] = React.useState("rawat-jalan");

  const tabsData = [
    {
      label: "Rawat Jalan",
      value: "rawat-jalan",
      content: "Content Rawat Jalan",
    },
    {
      label: "Rawat Inap",
      value: "rawat-inap",
      content: "Content Rawat Inap",
    },
  ];

  return (
    <Tabs value={activeTab}>
      <TabsHeader
        className="bg-softGreen/50 rounded-lg p-1 shadow-lg"
        indicatorProps={{
          className:
            "bg-secondary shadow-md rounded-lg",
        }}
      >
        {tabsData.map(({ label, value }) => (
          <Tab
            key={value}
            value={value}
            onClick={() => setActiveTab(value)}
            className={`font-medium transition-all duration-300 ${activeTab === value ? "text-white" : "text-secondary"
              }`}
          >
            {label}
          </Tab>
        ))}
      </TabsHeader>

      <TabsBody>
        {tabsData.map(({ value, content }) => (
          <TabPanel key={value} value={value}>
            {content}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
}
