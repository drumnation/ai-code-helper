import { Select } from 'antd';

const wordChoices = [
  'Ignore Complexity',
  'Simple',
  'Moderate',
  'Sophisticated',
  'Plain',
  'Ornate',
  'Elegant',
  'Poetic',
];

const subChoices = {
  'Ignore Complexity': [],
  Simple: ['Straightforward', 'Basic', 'Elementary', 'Uncomplicated'],
  Moderate: ['Intermediate', 'Middle-of-the-road', 'Moderate', 'Average'],
  Sophisticated: [
    'Complex',
    'Subtle',
    'Refined',
    'Eloquent',
    'Ornate',
    'Elaborate',
    'Cultured',
  ],
  Plain: ['Unadorned', 'Unembellished', 'Unassuming', 'Unpretentious'],
  Ornate: ['Elaborate', 'Florid', 'Ornamental', 'Decorated'],
  Elegant: ['Graceful', 'Refined', 'Polished', 'Stylish'],
  Poetic: ['Imaginative', 'Creative', 'Expressive', 'Figurative'],
};

const LanguageLevelSelect = ({
  languageLevelCategory,
  languageLevelSubChoices,
  handleLanguageLevelCategorySelect,
  handleLanguageLevelSubChoiceSelect,
}) => {
  console.debug('language', { languageLevelCategory, languageLevelSubChoices });
  return (
    <>
      <Select
        style={{ width: '100%' }}
        placeholder='Select a language complexity'
        onChange={handleLanguageLevelCategorySelect}
        value={languageLevelCategory}
      >
        {wordChoices.map((choice) => (
          <Select.Option key={choice} value={choice}>
            {choice}
          </Select.Option>
        ))}
      </Select>
      {languageLevelCategory &&
        languageLevelCategory !== 'Ignore Complexity' && (
          <Select
            style={{ width: '100%', marginTop: 8 }}
            placeholder='Select a complexity sub choice'
            onChange={handleLanguageLevelSubChoiceSelect}
            mode='multiple'
            value={languageLevelSubChoices}
          >
            {subChoices[languageLevelCategory].map((subChoice) => (
              <Select.Option key={subChoice} value={subChoice}>
                {subChoice}
              </Select.Option>
            ))}
          </Select>
        )}
    </>
  );
};
export default LanguageLevelSelect;
