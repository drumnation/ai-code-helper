import { Select } from 'antd';

const { Option } = Select;

const MultiSelectList = ({ descriptors, handleDescriptorRephrase }) => {
  return (
    <Select
      mode='multiple'
      style={{ width: '100%', marginLeft: 16 }}
      value={descriptors}
      onChange={handleDescriptorRephrase}
    >
      <Option value='Brief'>Brief</Option>
      <Option value='Clear'>Clear</Option>
      <Option value='Compelling'>Compelling</Option>
      <Option value='Concise'>Concise</Option>
      <Option value='Convincing'>Convincing</Option>
      <Option value='Descriptive'>Descriptive</Option>
      <Option value='Detailed'>Detailed</Option>
      <Option value='Dynamic'>Dynamic</Option>
      <Option value='Elaborate'>Elaborate</Option>
      <Option value='Engaging'>Engaging</Option>
      <Option value='Evocative'>Evocative</Option>
      <Option value='Expressive'>Expressive</Option>
      <Option value='Forceful'>Forceful</Option>
      <Option value='Firm'>Firm</Option>
      <Option value='Friendly'>Friendly</Option>
      <Option value='Informative'>Informative</Option>
      <Option value='Passionate'>Passionate</Option>
      <Option value='Persuasive'>Persuasive</Option>
      <Option value='Poetic'>Poetic</Option>
      <Option value='Powerful'>Powerful</Option>
      <Option value='Precise'>Precise</Option>
      <Option value='Succinct'>Succinct</Option>
      <Option value='Vivid'>Vivid</Option>
    </Select>
  );
};

export default MultiSelectList;
