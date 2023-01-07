import { Select } from 'antd';

const { Option } = Select;

const WritingStyleSelect = ({ writingStyle, handleWritingStyleRephrase }) => {
  return (
    <Select
      style={{ marginLeft: 10 }}
      defaultValue='No Style Change'
      value={writingStyle}
      onSelect={handleWritingStyleRephrase}
    >
      <Option value='No Style Change'>No Style Change</Option>
      <Option value='Conversational'>Conversational</Option>
      <Option value='Formal'>Formal</Option>
      <Option value='Professional'>Professional</Option>
      <Option value='Business'>Business</Option>
      <Option value='Technical'>Technical</Option>
      <Option value='Academic'>Academic</Option>
      <Option value='Creative'>Creative</Option>
      <Option value='Persuasive'>Persuasive</Option>
      <Option value='Informative'>Informative</Option>
      <Option value='Descriptive'>Descriptive</Option>
      <Option value='APA (American Psychological Association)'>
        APA (American Psychological Association)
      </Option>
      <Option value='MLA (Modern Language Association)'>
        MLA (Modern Language Association)
      </Option>
      <Option value='Chicago'>Chicago</Option>
      <Option value='Turabian'>Turabian</Option>
      <Option value='Harvard'>Harvard</Option>
      <Option value='IEEE (Institute of Electrical and Electronics Engineers)'>
        IEEE (Institute of Electrical and Electronics Engineers)
      </Option>
      <Option value='AMA (American Medical Association)'>
        AMA (American Medical Association)
      </Option>
      <Option value='Bluebook'>Bluebook</Option>
      <Option value='CGOS (Columbia Guide to Online)'>
        CGOS (Columbia Guide to Online)
      </Option>
      <Option value='ACM (Association for Computing Machinery)'>
        ACM (Association for Computing Machinery)
      </Option>
      <Option value='AP (Associated Press)'>AP (Associated Press)</Option>
      <Option value='Master Yoda from Star Wars'>Master Yoda</Option>
    </Select>
  );
};

export default WritingStyleSelect;
