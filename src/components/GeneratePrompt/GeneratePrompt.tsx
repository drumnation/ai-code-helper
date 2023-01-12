import {
  CaretRightOutlined,
  ClearOutlined,
  MailOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Collapse,
  Form,
  Input,
  Slider,
  Switch,
  Table,
} from 'antd';

import {
  PlayCircleOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import { Alert, Space } from 'antd';

import {
  DescriptorsSelect,
  Interviewer,
  LanguageLevelSelect,
  SummaryTable,
  WritingStyleSelect,
} from '..';

const { Panel } = Collapse;

const GeneratePrompt = ({
  clearInterview,
  descriptors,
  interview,
  generateInterview,
  handleUpdateInterview,
  enableWordCount,
  error,
  fallacies,
  fallacyColumns,
  generateEmailError,
  generateEmailResponse,
  generateFallacies,
  generateRootPrompt,
  generateSummary,
  handleChangeTemperature,
  handleChangeWordCount,
  handleDescriptorRephrase,
  handleFallacyFinderChange,
  handleLanguageLevelCategorySelect,
  handleLanguageLevelSubChoiceSelect,
  handleSummaryResponsesChange,
  handleToggleFirm,
  handleToggleWordCount,
  handleWritingStyleRephrase,
  includeFallacyFinder,
  includeSummaryResponses,
  isFirm,
  isSendEmail,
  languageLevelCategory,
  languageLevelSubChoices,
  loading,
  promptWordCount,
  rootPrompt,
  setRootPrompt,
  state,
  summary,
  temperature,
  updateSummaryRecord,
  writingStyle,
}) => {
  return (
    <Collapse
      style={{
        width: '100%',
        marginTop: 30,
        marginBottom: 20,
        background: '#fff',
      }}
      defaultActiveKey={['1']}
      accordion
      expandIcon={({ isActive }) => (
        <CaretRightOutlined
          style={{ marginTop: 8 }}
          rotate={isActive ? 90 : 0}
        />
      )}
    >
      <Panel
        style={{
          fontSize: 18,
          fontWeight: 500,
        }}
        collapsible='icon'
        // @ts-ignore
        align='left'
        header='Fine Tune Email'
        key='0'
        className='site-collapse-custom-collapse'
        extra={
          <Button
            type='primary'
            onClick={generateEmailResponse}
            loading={loading.emailResponse}
          >
            Generate Email {!loading.emailResponse && <MailOutlined />}
          </Button>
        }
      >
        {!isSendEmail && (
          <Card
            title='Fine Tuning and Analysis Tools'
            style={{ marginBottom: 10 }}
          >
            <ul
              style={{
                marginBottom: 0,
                marginLeft: 0,
                paddingLeft: 10,
                marginTop: -5,
              }}
            >
              <Button
                style={{
                  width: 145,
                  background: 'green',
                  marginRight: 10,
                  marginBottom: 10,
                }}
                type='primary'
                onClick={generateInterview}
                loading={loading.summary}
              >
                Interviewer {!loading.interviewer && <OrderedListOutlined />}
              </Button>
              <li>
                Use the <b>Interviewer</b> to be interviewed for context info
                about the email.
              </li>
              <Button
                style={{
                  width: 145,
                  background: 'green',
                  marginTop: 10,
                  marginRight: 10,
                  marginBottom: 10,
                }}
                type='primary'
                onClick={generateSummary}
                loading={loading.summary}
              >
                Summarizer {!loading.summary && <UnorderedListOutlined />}
              </Button>
              <li>
                Use the <b>Summarizer</b> to provide accurate feedback about
                each point {state.sender !== '' ? state.sender : 'SENDER'} has
                made.
              </li>
              <Button
                style={{
                  width: 145,
                  background: 'green',
                  marginRight: 10,
                  marginBottom: 10,
                  marginTop: 10,
                }}
                type='primary'
                onClick={generateFallacies}
                loading={loading.fallacies}
              >
                Fallacy Finder {!loading.fallacies && <PlayCircleOutlined />}
              </Button>
              <li>
                Use the <b>Fallacy Finder</b> to discover unfair or illogical
                arguments in {state.sender !== '' ? state.sender : 'SENDER'}'s
                email.
              </li>
            </ul>
            {error !== '' && (
              <Space
                direction='vertical'
                style={{ width: '100%', marginTop: 16 }}
              >
                <Alert
                  message='Error! Please try again.'
                  description={error}
                  type='error'
                />
              </Space>
            )}
          </Card>
        )}
        {fallacies.length > 0 && !isSendEmail && (
          <Table
            style={{
              width: '100%',
            }}
            pagination={false}
            dataSource={fallacies}
            columns={fallacyColumns}
          />
        )}
        {!isSendEmail && <div style={{ height: 16 }} />}
        {!isSendEmail && summary?.length > 0 && (
          <SummaryTable data={summary} updateRecord={updateSummaryRecord} />
        )}
        {!isSendEmail && interview?.length > 0 && (
          <Interviewer
            clearInterview={clearInterview}
            interview={interview}
            handleUpdateInterview={handleUpdateInterview}
          />
        )}
        {!isSendEmail && (
          <Switch
            style={{
              marginLeft: 16,
              marginBottom: 16,
            }}
            checked={isFirm}
            onChange={handleToggleFirm}
            checkedChildren={<div>Unapologetic</div>}
            unCheckedChildren={<div>Apologetic</div>}
          />
        )}
        <Form.Item
          style={{
            marginLeft: 16,
            marginRight: 31,
            marginTop: isSendEmail ? 0 : 16,
            marginBottom: 16,
          }}
          label='Tone'
        >
          <DescriptorsSelect
            descriptors={descriptors}
            handleDescriptorRephrase={handleDescriptorRephrase}
          />
        </Form.Item>
        <Form.Item
          style={{
            marginLeft: 16,
            marginRight: 31,
            marginTop: isSendEmail ? 0 : 16,
            marginBottom: 16,
          }}
          label='Language Complexity'
        >
          <LanguageLevelSelect
            handleLanguageLevelCategorySelect={
              handleLanguageLevelCategorySelect
            }
            handleLanguageLevelSubChoiceSelect={
              handleLanguageLevelSubChoiceSelect
            }
            languageLevelCategory={languageLevelCategory}
            languageLevelSubChoices={languageLevelSubChoices}
          />
        </Form.Item>
        <Form.Item
          style={{
            marginLeft: 16,
            marginRight: 25,
            marginTop: isSendEmail ? 0 : 16,
            marginBottom: 8,
          }}
          label='Writing Style'
        >
          <WritingStyleSelect
            writingStyle={writingStyle}
            handleWritingStyleRephrase={handleWritingStyleRephrase}
          />
        </Form.Item>
        <div
          style={{
            padding: 16,
          }}
        >
          <Form.Item label='Word Count'>
            <Switch
              style={{
                marginLeft: 5,
              }}
              checked={enableWordCount}
              onChange={handleToggleWordCount}
            />
          </Form.Item>
          <Slider
            style={{
              marginTop: -15,
            }}
            disabled={!enableWordCount}
            min={10}
            max={1000}
            step={1}
            tooltip={{
              open: enableWordCount,
            }}
            value={promptWordCount}
            onChange={handleChangeWordCount}
          />
          <Form.Item
            style={{ marginBottom: 16, marginTop: 16 }}
            label='Generation Randomness'
          >
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={temperature}
              onChange={handleChangeTemperature}
            />
          </Form.Item>
          {!isSendEmail && (
            <>
              <Checkbox
                disabled={summary.length === 0}
                checked={includeSummaryResponses}
                onChange={handleSummaryResponsesChange}
                style={{
                  marginBottom: 15,
                }}
              >
                Include Summary Responses
              </Checkbox>
              <Checkbox
                disabled={fallacies.length === 0}
                checked={includeFallacyFinder}
                onChange={handleFallacyFinderChange}
                style={{
                  marginBottom: 15,
                }}
              >
                Include Fallacy Prompts
              </Checkbox>
            </>
          )}
          <Input.TextArea
            style={{
              height: '100%',
            }}
            autoSize
            placeholder='Enter root prompt'
            onChange={(event) => setRootPrompt(event.target.value)}
            value={rootPrompt}
          />
          <Button.Group>
            <Button
              style={{
                marginBottom: 0,
                marginTop: 20,
                width: 160,
              }}
              type='primary'
              onClick={generateEmailResponse}
              loading={loading.emailResponse}
            >
              Generate Email {!loading.emailResponse && <MailOutlined />}
            </Button>
            <Button
              style={{
                background: 'red',
                marginBottom: 0,
                marginTop: 20,
                width: 160,
              }}
              type='primary'
              onClick={generateRootPrompt}
              loading={loading.rootPrompt}
            >
              Reset Prompt <ClearOutlined />
            </Button>
          </Button.Group>
          {generateEmailError !== '' && (
            <Space direction='vertical' style={{ width: '100%' }}>
              <Alert
                message='Error! Please try again.'
                description={generateEmailError}
                type='error'
              />
            </Space>
          )}
        </div>
      </Panel>
    </Collapse>
  );
};

export default GeneratePrompt;
