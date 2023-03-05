import { ProfileOutlined, SettingOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import CustomFixInstructionTextbox from './CustomFixInstructionTexbox';

export function FixButtonGroup({
  handleClickFixTest,
  handleClickFixFunction,
  loading,
  index,
  unitTests,
  customFixInstructions,
  handleChangeCustomFixInstruction,
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <CustomFixInstructionTextbox
          onPressEnter={() =>
            handleClickFixTest({
              index,
              unitTests,
              customInstruction: customFixInstructions[index]?.fixTest ?? '',
            })
          }
          customFixInstructions={customFixInstructions}
          type='fixTest'
          index={index}
          handleChangeCustomFixInstruction={handleChangeCustomFixInstruction}
        />
        <CustomFixInstructionTextbox
          onPressEnter={() =>
            handleClickFixFunction({
              index,
              unitTests,
              customInstruction:
                customFixInstructions[index]?.fixFunction ?? '',
            })
          }
          customFixInstructions={customFixInstructions}
          type='fixFunction'
          index={index}
          handleChangeCustomFixInstruction={handleChangeCustomFixInstruction}
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
          loading={loading.fixTest}
          type='primary'
          onClick={() =>
            handleClickFixTest({
              index,
              unitTests,
              customInstruction: customFixInstructions[index]?.fixTest ?? '',
            })
          }
        >
          Fix Test to Match Function Output{' '}
          {!loading.fixTest && <ProfileOutlined />}
        </Button>
        <Button
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 300,
            background: '#ff6600',
          }}
          loading={loading.fixFunction}
          type='primary'
          onClick={() => handleClickFixFunction({ index, unitTests })}
        >
          Fix Function to Match Expected Output{' '}
          {!loading.fixFunction && <SettingOutlined />}
        </Button>
      </div>
    </div>
  );
}
