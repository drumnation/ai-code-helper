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

import { PlayCircleOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Alert, Space } from 'antd';

import { SummaryTable } from '..';

const { Panel } = Collapse;

const GeneratePrompt = ({
  enableWordCount,
  error,
  fallacies,
  fallacyColumns,
  generateEmailResponse,
  generateFallacies,
  generateRootPrompt,
  generateSummary,
  handleChangeWordCount,
  handleFallacyFinderChange,
  handleSummaryResponsesChange,
  handleToggleFirm,
  handleToggleWordCount,
  includeFallacyFinder,
  includeSummaryResponses,
  isFirm,
  isSendEmail,
  loading,
  promptWordCount,
  rootPrompt,
  setRootPrompt,
  summary,
  state,
  updateSummaryRecord,
}) => {
  return (
    <Collapse
      style={{
        width: '100%',
        marginTop: 30,
        marginBottom: 10,
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
        <Card
          title='Fine Tuning and Analysis Tools'
          style={{ marginBottom: 10 }}
        >
          <Button
            style={{ width: 160, background: 'green' }}
            type='primary'
            onClick={generateFallacies}
            loading={loading.fallacies}
          >
            Fallacy Finder {!loading.fallacies && <PlayCircleOutlined />}
          </Button>
          <Button
            style={{ width: 160, marginLeft: 10, background: 'green' }}
            type='primary'
            onClick={generateSummary}
            loading={loading.summary}
          >
            Summarizer {!loading.summary && <UnorderedListOutlined />}
          </Button>
          {error !== '' && (
            <Space direction='vertical' style={{ width: '100%' }}>
              <Alert
                message='Error! Please try again.'
                description={error}
                type='error'
              />
            </Space>
          )}
          <ul style={{ marginBottom: 0, marginLeft: 0, paddingLeft: 10 }}>
            <li>
              Use the <b>Fallacy Finder</b> to discover unfair or illogical
              arguments in {state.sender !== '' ? state.sender : 'SENDER'}'s
              email.
            </li>
            <li>
              Use the <b>Summarizer</b> to provide accurate feedback about each
              point {state.sender !== '' ? state.sender : 'SENDER'} has made.
            </li>
          </ul>
        </Card>
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
        <div style={{ height: 16 }} />
        {summary.length > 0 && (
          <SummaryTable data={summary} updateRecord={updateSummaryRecord} />
        )}
        <Form.Item
          style={{
            marginLeft: 16,
            marginTop: 16,
            marginBottom: -10,
          }}
          label='Tone'
        >
          <Switch
            style={{
              marginLeft: 5,
            }}
            checked={isFirm}
            onChange={handleToggleFirm}
            checkedChildren={<div>Firm</div>}
            unCheckedChildren={<div>Apologetic</div>}
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
        </div>
      </Panel>
    </Collapse>
  );
};

export default GeneratePrompt;
