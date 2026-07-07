import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");
const dataPath = path.join(__dirname, "feature_tracker_data.json");
const threadId = "019f3e2b-c0a9-73a2-bab3-c0bf76811cd3";
const outputDir = path.join(repoRoot, "outputs", threadId);
const outputPath = path.join(outputDir, "site-feature-tracker.xlsx");

const raw = await fs.readFile(dataPath, "utf8");
const { features } = JSON.parse(raw);

const workbook = Workbook.create();
const summary = workbook.worksheets.add("Summary");
const sheet = workbook.worksheets.add("Features");

sheet.showGridLines = false;
summary.showGridLines = false;

const header = [
  "Feature ID",
  "Area",
  "Example Route",
  "User Story",
  "Expected Behavior",
  "Source Files",
  "Test Status",
  "Issue Summary",
  "Severity",
  "Fix Status",
  "Fix Commit",
  "Retest Status",
  "Notes"
];

const rows = features.map((feature) => [
  feature.id,
  feature.area,
  feature.exampleRoute,
  feature.userStory,
  feature.expectedBehavior,
  feature.sourceFiles,
  feature.testStatus,
  feature.issueSummary,
  feature.severity,
  feature.fixStatus,
  feature.fixCommit,
  feature.retestStatus,
  feature.notes
]);

sheet.getRange(`A1:M${rows.length + 1}`).values = [header, ...rows];
sheet.freezePanes.freezeRows(1);

sheet.getRange("A1:M1").format = {
  fill: "#16324F",
  font: { bold: true, color: "#FFFFFF" },
  verticalAlignment: "center",
  horizontalAlignment: "center",
  wrapText: true,
  rowHeight: 28
};

sheet.getRange(`A2:M${rows.length + 1}`).format = {
  verticalAlignment: "top",
  wrapText: true
};

sheet.getRange(`A1:M${rows.length + 1}`).format.borders = {
  insideHorizontal: { style: "thin", color: "#D7DEE8" },
  insideVertical: { style: "thin", color: "#D7DEE8" },
  top: { style: "medium", color: "#90A4B8" },
  bottom: { style: "medium", color: "#90A4B8" },
  left: { style: "medium", color: "#90A4B8" },
  right: { style: "medium", color: "#90A4B8" }
};

const columnWidths = {
  A: 14,
  B: 18,
  C: 28,
  D: 42,
  E: 48,
  F: 32,
  G: 15,
  H: 34,
  I: 12,
  J: 16,
  K: 18,
  L: 16,
  M: 32
};

for (const [column, width] of Object.entries(columnWidths)) {
  sheet.getRange(`${column}:${column}`).format.columnWidth = width;
}

sheet.getRange(`G2:G${rows.length + 1}`).dataValidation = {
  rule: {
    type: "list",
    values: ["Not Tested", "Pass", "Fail", "Blocked"]
  }
};

sheet.getRange(`I2:I${rows.length + 1}`).dataValidation = {
  rule: {
    type: "list",
    values: ["", "Low", "Medium", "High"]
  }
};

sheet.getRange(`J2:J${rows.length + 1}`).dataValidation = {
  rule: {
    type: "list",
    values: ["Not Needed Yet", "Not Needed", "Pending", "Fixed", "Blocked"]
  }
};

sheet.getRange(`L2:L${rows.length + 1}`).dataValidation = {
  rule: {
    type: "list",
    values: ["Not Retested", "Pass", "Fail", "Blocked"]
  }
};

sheet.getRange(`G2:G${rows.length + 1}`).conditionalFormats.add("containsText", {
  text: "Pass",
  format: { fill: "#DCFCE7", font: { color: "#166534", bold: true } }
});
sheet.getRange(`G2:G${rows.length + 1}`).conditionalFormats.add("containsText", {
  text: "Fail",
  format: { fill: "#FEE2E2", font: { color: "#991B1B", bold: true } }
});
sheet.getRange(`G2:G${rows.length + 1}`).conditionalFormats.add("containsText", {
  text: "Blocked",
  format: { fill: "#FEF3C7", font: { color: "#92400E", bold: true } }
});

sheet.getRange(`J2:J${rows.length + 1}`).conditionalFormats.add("containsText", {
  text: "Fixed",
  format: { fill: "#DBEAFE", font: { color: "#1D4ED8", bold: true } }
});
sheet.getRange(`J2:J${rows.length + 1}`).conditionalFormats.add("containsText", {
  text: "Pending",
  format: { fill: "#FDE68A", font: { color: "#92400E", bold: true } }
});
sheet.getRange(`J2:J${rows.length + 1}`).conditionalFormats.add("containsText", {
  text: "Blocked",
  format: { fill: "#FECACA", font: { color: "#991B1B", bold: true } }
});

sheet.getRange(`L2:L${rows.length + 1}`).conditionalFormats.add("containsText", {
  text: "Pass",
  format: { fill: "#DCFCE7", font: { color: "#166534", bold: true } }
});
sheet.getRange(`L2:L${rows.length + 1}`).conditionalFormats.add("containsText", {
  text: "Fail",
  format: { fill: "#FEE2E2", font: { color: "#991B1B", bold: true } }
});
sheet.getRange(`L2:L${rows.length + 1}`).conditionalFormats.add("containsText", {
  text: "Blocked",
  format: { fill: "#FEF3C7", font: { color: "#92400E", bold: true } }
});

summary.getRange("A1:F1").merge();
summary.getRange("A1").values = [["Site Feature Audit Tracker"]];
summary.getRange("A1:F1").format = {
  fill: "#16324F",
  font: { bold: true, color: "#FFFFFF", size: 16 },
  horizontalAlignment: "center",
  verticalAlignment: "center"
};
summary.getRange("A2:F4").format = {
  fill: "#F8FAFC"
};

summary.getRange("A2:B7").values = [
  ["Goal", "Inventory site features, test each user story, document defects, fix logistical and UX issues, then retest."],
  ["Feature Rows", features.length],
  ["Generated From", "work/goals/site-feature-audit/feature_tracker_data.json"],
  ["Generated Workbook", outputPath],
  ["Last Refresh", new Date().toISOString().replace("T", " ").replace(/\..+/, " UTC")],
  ["Notes", "Use the Features sheet as the working audit matrix."]
];
summary.getRange("A2:A7").format = {
  font: { bold: true, color: "#16324F" }
};
summary.getRange("A2:B7").format.borders = {
  preset: "outside",
  style: "thin",
  color: "#CBD5E1"
};
summary.getRange("A2:B7").format.wrapText = true;
summary.getRange("A:A").format.columnWidth = 18;
summary.getRange("B:B").format.columnWidth = 92;

summary.getRange("D2:E2").values = [["Status", "Count"]];
summary.getRange("D2:E2").format = {
  fill: "#E2E8F0",
  font: { bold: true, color: "#16324F" },
  horizontalAlignment: "center"
};
summary.getRange("D3:D10").values = [
  ["Not Tested"],
  ["Pass"],
  ["Fail"],
  ["Blocked"],
  ["Pending Fix"],
  ["Fixed"],
  ["Not Retested"],
  ["Retest Pass"]
];
summary.getRange("E3").formulas = [[`=COUNTIF(Features!$G$2:$G$${rows.length + 1},"Not Tested")`]];
summary.getRange("E4").formulas = [[`=COUNTIF(Features!$G$2:$G$${rows.length + 1},"Pass")`]];
summary.getRange("E5").formulas = [[`=COUNTIF(Features!$G$2:$G$${rows.length + 1},"Fail")`]];
summary.getRange("E6").formulas = [[`=COUNTIF(Features!$G$2:$G$${rows.length + 1},"Blocked")`]];
summary.getRange("E7").formulas = [[`=COUNTIF(Features!$J$2:$J$${rows.length + 1},"Pending")`]];
summary.getRange("E8").formulas = [[`=COUNTIF(Features!$J$2:$J$${rows.length + 1},"Fixed")`]];
summary.getRange("E9").formulas = [[`=COUNTIF(Features!$L$2:$L$${rows.length + 1},"Not Retested")`]];
summary.getRange("E10").formulas = [[`=COUNTIF(Features!$L$2:$L$${rows.length + 1},"Pass")`]];

summary.getRange("D2:E10").format.borders = {
  preset: "all",
  style: "thin",
  color: "#CBD5E1"
};
summary.getRange("D2:E10").format.wrapText = true;
summary.getRange("D:D").format.columnWidth = 20;
summary.getRange("E:E").format.columnWidth = 12;

summary.getRange("D12:E17").values = [
  ["Value", "Meaning"],
  ["Pass", "Expected behavior matched the code and smoke test."],
  ["Fail", "Observed behavior diverged and needs a fix or a decision."],
  ["Blocked", "Could not test end-to-end without an external action or missing runtime."],
  ["Pending", "Issue confirmed and waiting on a code change."],
  ["Fixed", "Code change landed and needs or passed retest."]
];
summary.getRange("D12:E12").format = {
  fill: "#E2E8F0",
  font: { bold: true, color: "#16324F" }
};
summary.getRange("D12:E17").format.borders = {
  preset: "all",
  style: "thin",
  color: "#CBD5E1"
};
summary.getRange("E12:E17").format.wrapText = true;

await fs.mkdir(outputDir, { recursive: true });
const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputPath);

console.log(outputPath);
