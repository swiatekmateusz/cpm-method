export const borderColor = "#3e3e3e";

const getTextFontSize = (text: React.ReactNode) => {
  if (typeof text !== "string") {
    return "8px";
  }
  if (text.length <= 1) {
    return "18px";
  }
  if (text.length <= 2) {
    return "16px";
  }
  if (text.length <= 3) {
    return "12px";
  }
  if (text.length <= 4) {
    return "10px";
  }
  return "8px";
};

export const QuarterCircle = ({
  text1 = "9",
  text2 = "",
  text3 = "",
  text4 = "",
  isCritical = false,
}: {
  text1: React.ReactNode;
  text2: React.ReactNode;
  text3: React.ReactNode;
  text4: React.ReactNode;
  isCritical?: boolean;
}) => {
  return (
    <div
      className="quarterContainer"
      style={{
        border: isCritical ? `1px solid red` : `1px solid ${borderColor}`,
      }}
    >
      <div
        className="quarterStyle first-quater"
        style={{
          fontSize: getTextFontSize(text1),
        }}
      >
        {text1}
      </div>

      <div
        className="quarterStyle second-quater"
        style={{
          fontSize: getTextFontSize(text2),
        }}
      >
        {text2}
      </div>
      <div
        className="quarterStyle third-quater"
        style={{
          fontSize: getTextFontSize(text3),
        }}
      >
        {text3}
      </div>
      <div
        className="quarterStyle fourth-quater"
        style={{
          fontSize: getTextFontSize(text4),
        }}
      >
        {text4}
      </div>
      <div
        style={{
          background: borderColor,
        }}
        className="quater-separator"
      ></div>
      <div
        className="quater-separator-2"
        style={{
          background: borderColor,
        }}
      ></div>
    </div>
  );
};
