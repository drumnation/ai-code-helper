import { Input } from 'antd';
import { labelStyle, inputStyle } from './CustomFixInstructionsTextbox.style';
import {
  camelCaseToTwoWords,
  handleChangeCustomFixInstruction,
} from './CustomFixInstructionTextbox.logic';

const { TextArea } = Input;

const CustomFixInstructionTextbox = ({
  type,
  index,
  customFixInstructions,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <h3 style={labelStyle}>Custom {camelCaseToTwoWords(type)} Instruction</h3>
      <TextArea
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
