import { updateCustomFixInstructions } from '../../../../redux/unitTests.slice';
import { IHandleChangeCustomFixInstruction } from '../../../../types';

export const handleChangeCustomFixInstruction = ({
  index,
  instruction,
  type,
  customFixInstructions: customFixInstructions_,
}: IHandleChangeCustomFixInstruction) => {
  const newCustomFixInstructions = { ...customFixInstructions_ };
  newCustomFixInstructions[index] = {
    ...newCustomFixInstructions[index],
    [type]: instruction,
  };
  updateCustomFixInstructions(newCustomFixInstructions);
};

export function camelCaseToTwoWords(str) {
  const result = str.replace(/([A-Z])/g, ' $1');
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
  return finalResult;
}
