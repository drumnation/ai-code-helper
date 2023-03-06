import { ProfileOutlined, SettingOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import CustomFixInstructionTextbox from '../CustomFixInstructionTextbox/CustomFixInstructionTextbox';
import { ICustomFixInstructions, IUnitTests } from '../../../../types';
import {
  handleClickFixFunction,
  handleClickFixTest,
} from './FixButtonGroup.logic';
import { useLoadingState } from '../../../../redux/loading.slice';

export const FixButtonGroup = ({
  index,
  unitTests,
  customFixInstructions,
}: {
  index: number;
  unitTests: IUnitTests;
  customFixInstructions: ICustomFixInstructions;
}) => {
  const { fixTest, fixFunction } = useLoadingState();
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <CustomFixInstructionTextbox
          customFixInstructions={customFixInstructions}
          type='fixTest'
          index={index}
        />
        <CustomFixInstructionTextbox
          customFixInstructions={customFixInstructions}
          type='fixFunction'
          index={index}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 300,
            background: '#ff6600',
          }}
          loading={fixTest}
          type='primary'
          onClick={() =>
            handleClickFixTest({
              index,
              unitTests,
              customInstruction: customFixInstructions[index]?.fixTest ?? '',
            })
          }
        >
          Fix Test to Match Function Output {!fixTest && <ProfileOutlined />}
        </Button>
        <Button
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 300,
            background: '#ff6600',
          }}
          loading={fixFunction}
          type='primary'
          onClick={() =>
            handleClickFixFunction({
              index,
              unitTests,
              customInstruction:
                customFixInstructions[index]?.fixFunction ?? '',
            })
          }
        >
          Fix Function to Match Expected Output{' '}
          {!fixFunction && <SettingOutlined />}
        </Button>
      </div>
    </div>
  );
};
