import './App.css';

import {
  CopyOutlined,
  DeleteOutlined,
  MailOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Collapse,
  Input,
  List,
  Space,
  Table,
  Tag,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import useApp from './App.hooks';
import { fallacyColumns, formatDate, wordCount } from './App.logic';
import { GeneratePrompt, NewEmailPoint } from './components';

function App() {
  const {
    clearInterview,
    descriptors,
    draftEmailVersions,
    enableWordCount,
    error,
    fallacies,
    generateEmailError,
    generateEmailResponse,
    generateFallacies,
    generateInterview,
    generateRootPrompt,
    generateSummary,
    handleAddNewDraftEmail,
    handleAddNewSendEmailPoint,
    handleChangeReceiver,
    handleChangeReplyToEmail,
    handleChangeSender,
    handleChangeTemperature,
    handleChangeWordCount,
    handleClearReplyToEmail,
    handleClearSendEmailPoints,
    handleClickSentenceSuggestions,
    handleCopy,
    handleDescriptorRephrase,
    handleFallacyFinderChange,
    handleLanguageLevelCategorySelect,
    handleLanguageLevelSubChoiceSelect,
    handleRemoveSendEmailPoint,
    handleSentenceSelect,
    handleSummaryResponsesChange,
    handleToggleFirm,
    handleToggleWordCount,
    handleUpdateInterview,
    handleUpdateIsSendEmail,
    handleUpdateSendEmailPoints,
    handleWritingStyleRephrase,
    includeFallacyFinder,
    includeSummaryResponses,
    interview,
    isFirm,
    isSendEmail,
    languageLevelCategory,
    languageLevelSubChoices,
    loading,
    promptWordCount,
    rootPrompt,
    selectedSentence,
    sendEmailPoints,
    sentenceSuggestions,
    sentenceSuggestionsLoading,
    setRootPrompt,
    state,
    summary,
    temperature,
    updateState,
    updateSummaryRecord,
    writingStyle,
  } = useApp();

  return (
    <div className='App'>
      <header className='App-header'>
        <div style={{ display: 'flex', marginTop: 10 }}>
          <MailOutlined
            className='App-logo'
            style={{ marginRight: 15, marginTop: 5 }}
          />
          <div>HIM</div>
        </div>
      </header>
      <div className='App-body'>
        <h3 style={{ marginBottom: 0, marginTop: 10 }} className='Cool-font'>
          AI Email Composer
        </h3>
        <h4 style={{ marginTop: 10 }}>
          <i>For Difficult Conversations with High Conflict People</i>
        </h4>
        {isSendEmail ? (
          <Card
            // @ts-ignore
            align='left'
            title='New Email'
            style={{ width: '100%' }}
            extra={
              <Button
                style={{ marginBottom: 10, marginTop: 10 }}
                type='primary'
                onClick={handleUpdateIsSendEmail}
              >
                Reply to an Email <MailOutlined />
              </Button>
            }
          >
            <FormItem label='Sender' style={{ marginBottom: 5 }}>
              <Input
                style={{ marginLeft: 15, width: 200 }}
                placeholder='Sender Name Here'
                onChange={handleChangeSender}
                value={state.sender}
              />
            </FormItem>
            <FormItem
              label='Receiver'
              style={{ marginTop: 10, marginBottom: 10 }}
            >
              <Input
                placeholder='Receiver Name Here'
                style={{ marginLeft: 5, width: 200 }}
                onChange={handleChangeReceiver}
                value={state.receiver}
              />
            </FormItem>
            <h4>What points should this email make?</h4>
            <NewEmailPoint
              selectedSentence={selectedSentence}
              handleSentenceSelect={handleSentenceSelect}
              handleAddNewSendEmailPoint={handleAddNewSendEmailPoint}
              handleClickSentenceSuggestions={handleClickSentenceSuggestions}
              handleRemoveSendEmailPoint={handleRemoveSendEmailPoint}
              handleUpdateSendEmailPoints={handleUpdateSendEmailPoints}
              sentenceSuggestionsLoading={sentenceSuggestionsLoading}
              sendEmailPoints={sendEmailPoints}
              sentenceSuggestions={sentenceSuggestions}
            />
            <Button
              style={{ marginTop: 20, background: 'red' }}
              type='primary'
              onClick={handleClearSendEmailPoints}
            >
              Clear <DeleteOutlined />
            </Button>
          </Card>
        ) : (
          <Card
            // @ts-ignore
            align='left'
            title='Reply'
            style={{ width: '100%' }}
            extra={
              <Button
                style={{ marginBottom: 10, marginTop: 10 }}
                type='primary'
                onClick={handleUpdateIsSendEmail}
              >
                Compose a New Email <MailOutlined />
              </Button>
            }
          >
            <FormItem label='Sender' style={{ marginBottom: 5 }}>
              <Input
                style={{ marginLeft: 15, width: 200 }}
                placeholder='Sender Name Here'
                onChange={handleChangeSender}
                value={state.sender}
              />
            </FormItem>
            <FormItem
              label='Receiver'
              style={{ marginTop: 10, marginBottom: 10 }}
            >
              <Input
                placeholder='Receiver Name Here'
                style={{ marginLeft: 5, width: 200 }}
                onChange={handleChangeReceiver}
                value={state.receiver}
              />
            </FormItem>
            <h4>What email are we responding to?</h4>
            <Input.TextArea
              autoSize
              placeholder='Paste email here'
              onChange={handleChangeReplyToEmail}
              value={state.email}
            />
            <Button
              style={{ marginTop: 20, background: 'red' }}
              type='primary'
              onClick={handleClearReplyToEmail}
            >
              Clear <DeleteOutlined />
            </Button>
          </Card>
        )}

        <GeneratePrompt
          clearInterview={clearInterview}
          interview={interview}
          generateInterview={generateInterview}
          handleUpdateInterview={handleUpdateInterview}
          descriptors={descriptors}
          enableWordCount={enableWordCount}
          error={error}
          fallacies={fallacies}
          fallacyColumns={fallacyColumns}
          generateEmailError={generateEmailError}
          generateEmailResponse={generateEmailResponse}
          generateFallacies={generateFallacies}
          generateRootPrompt={generateRootPrompt}
          generateSummary={generateSummary}
          handleChangeTemperature={handleChangeTemperature}
          handleChangeWordCount={handleChangeWordCount}
          handleDescriptorRephrase={handleDescriptorRephrase}
          handleFallacyFinderChange={handleFallacyFinderChange}
          handleLanguageLevelCategorySelect={handleLanguageLevelCategorySelect}
          handleLanguageLevelSubChoiceSelect={
            handleLanguageLevelSubChoiceSelect
          }
          handleSummaryResponsesChange={handleSummaryResponsesChange}
          handleToggleFirm={handleToggleFirm}
          handleToggleWordCount={handleToggleWordCount}
          handleWritingStyleRephrase={handleWritingStyleRephrase}
          includeFallacyFinder={includeFallacyFinder}
          includeSummaryResponses={includeSummaryResponses}
          isFirm={isFirm}
          isSendEmail={isSendEmail}
          languageLevelCategory={languageLevelCategory}
          languageLevelSubChoices={languageLevelSubChoices}
          loading={loading}
          promptWordCount={promptWordCount}
          rootPrompt={rootPrompt}
          setRootPrompt={setRootPrompt}
          state={state}
          summary={summary}
          temperature={temperature}
          updateSummaryRecord={updateSummaryRecord}
          writingStyle={writingStyle}
        />

        {state.emailResponse !== '' && (
          <>
            <Card
              // @ts-ignore
              align='left'
              title={`Response Email${
                state.emailResponse !== ''
                  ? ' (' + wordCount(state.emailResponse) + ' words)'
                  : ''
              }`}
              bodyStyle={{ padding: 0 }}
              style={{ width: '100%', marginBottom: 20, marginTop: 20 }}
              extra={
                state.emailResponse !== '' && (
                  <Button.Group>
                    <Button onClick={handleAddNewDraftEmail}>
                      <CopyOutlined /> Save Draft
                    </Button>
                    <Button onClick={handleCopy}>
                      <CopyOutlined /> Copy
                    </Button>
                  </Button.Group>
                )
              }
            >
              {fallacies.length > 0 && isSendEmail && (
                <Table
                  style={{ width: '100%' }}
                  pagination={false}
                  dataSource={fallacies}
                  columns={fallacyColumns}
                />
              )}

              <div style={{ padding: 16 }}>
                {draftEmailVersions.length > 0 && (
                  <List
                    style={{ marginBottom: 16 }}
                    itemLayout='horizontal'
                    dataSource={draftEmailVersions}
                    renderItem={(item) => (
                      <Collapse style={{ marginBottom: 5 }}>
                        <Collapse.Panel
                          key={item.title}
                          header={
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              <b>{item.title}</b>
                              <div className='Panel'>
                                {item.languageLevelCategory}
                                {item.languageLevelSubChoices}
                                {item.description}

                                {item.isFirm ? (
                                  <Tag color='#2e75ab'>Unapologetic</Tag>
                                ) : (
                                  <Tag color='#cf1e8b'>Apologetic</Tag>
                                )}
                                {item.enableWordCount ? (
                                  <Tag color='#000000'>
                                    {item.wordCount} words
                                  </Tag>
                                ) : (
                                  ''
                                )}
                                {item.tone}
                              </div>
                              <Tag color='#000000'>
                                {formatDate(item.created)}
                              </Tag>
                            </div>
                          }
                        >
                          <pre
                            style={{
                              whiteSpace: 'pre-wrap',
                              textAlign: 'left',
                            }}
                          >
                            {item.email}
                          </pre>
                        </Collapse.Panel>
                      </Collapse>
                    )}
                  />
                )}
                <Input.TextArea
                  disabled={state.emailResponse === ''}
                  style={{ height: '100%' }}
                  autoSize
                  placeholder='Enter an email'
                  onChange={(event) =>
                    updateState({ ...state, emailResponse: event.target.value })
                  }
                  value={state.emailResponse}
                />
                {isSendEmail && state.emailResponse !== '' && (
                  <>
                    <Button
                      style={{ marginBottom: 10, marginTop: 30, width: 160 }}
                      type='primary'
                      onClick={generateFallacies}
                      loading={loading.fallacies}
                    >
                      Fallacy Finder{' '}
                      {!loading.fallacies && <PlayCircleOutlined />}
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
                  </>
                )}
              </div>
            </Card>
            <div style={{ height: 50 }} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;

{
  /* <ArrowDownOutlined style={{ marginTop: 50 }} />
        <Button
          style={{ marginBottom: 50, marginTop: 50 }}
          type='primary'
          onClick={generateDebatePrompt}
          loading={loading.debatePrompt}
        >
          Generate Debate Prompt <SyncOutlined />
        </Button>
        <ArrowDownOutlined style={{ marginBottom: 50 }} />
        <Card
          title='One Sided Debate Argument'
          style={{ width: '100%' }}
          // @ts-ignore
          align='left'
        >
          <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
            {state.oneSidedArgument}
          </pre>
        </Card>
        <ArrowDownOutlined style={{ marginBottom: 50, marginTop: 50 }} />
        <Card
          title='Combination of Debater and Fallacy Finder'
          style={{ width: '100%' }}
          // @ts-ignore
          align='left'
        >
          <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
            {state.combinedKnowledge}
          </pre>
          </Card> */
}
