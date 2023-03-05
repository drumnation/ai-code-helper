import { Input } from 'antd';

const { TextArea } = Input;

const CustomFixInstructionTextbox = ({
  type,
  index,
  customFixInstructions,
  handleChangeCustomFixInstruction,
  onPressEnter,
  marginRight = 0,
}) => {
  const inputStyle = {
    color: '#fff',
    backgroundColor: '#222',
    border: '1px solid #444',
    borderRadius: '4px',
    marginBottom: 10,
    marginRight,
    flex: 1,
  };

  const labelStyle = {
    marginTop: 10,
    marginBottom: 10,
    color: '#fff',
    fontWeight: 700,
  };

  function camelCaseToTwoWords(str) {
    const result = str.replace(/([A-Z])/g, ' $1');
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <h3 style={labelStyle}>Custom {camelCaseToTwoWords(type)} Instruction</h3>
      <TextArea
        onPressEnter={onPressEnter}
        value={customFixInstructions?.[index]?.[type]}
        onChange={(text) =>
          handleChangeCustomFixInstruction({
            instruction: text.target.value,
            index,
            customFixInstructions,
            type,
          })
        }
        autoSize={{ minRows: 2, maxRows: 6 }}
        style={inputStyle}
      />
    </div>
  );
};

export default CustomFixInstructionTextbox;
