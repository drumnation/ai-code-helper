import {
  LoadingOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Checkbox, Table } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';
import { wordCount } from '../../App.logic';

function NewEmailPoint({
  handleAddNewSendEmailPoint,
  handleClickSentenceSuggestions,
  handleRemoveSendEmailPoint,
  handleUpdateSendEmailPoints,
  sendEmailPoints,
  sentenceSuggestions,
  sentenceSuggestionsLoading,
  handleSentenceSelect,
  selectedSentence,
}) {
  return sendEmailPoints.map((point, index) => {
    const pointWordCount = wordCount(point);
    const sentenceSuggestionColumns = [
      {
        title: '',
        dataIndex: 'selected',
        key: 'selected',
        render: (_, record) => (
          <Checkbox
            checked={selectedSentence[index] === record.key}
            onChange={() =>
              handleSentenceSelect({
                i: index,
                key: record.key,
                selectedSentence,
              })
            }
          />
        ),
      },
      {
        title: `${
          sentenceSuggestions?.[index] !== undefined &&
          Object.values(sentenceSuggestions?.[index]).length
        } Alternate Sentences`,
        dataIndex: 'suggestion',
        key: 'suggestion',
        render: (_, record) => (
          <>
            ({wordCount(record.suggestion)}) {record.suggestion}
          </>
        ),
      },
    ];

    let pagination:
      | {
          pageSize: number;
        }
      | boolean = { pageSize: 5 };
    if (
      sentenceSuggestions?.[index] !== undefined &&
      Object.values(sentenceSuggestions?.[index]).length <= 5
    ) {
      pagination = false;
    }
    return (
      <div>
        <FormItem
          key={`Point #${index + 1}`}
          label={`Point #${index + 1} (${pointWordCount})`}
          style={{
            marginTop: 5,
            marginBottom: 10,
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            {sentenceSuggestions?.[index] !== undefined &&
              Object.values(sentenceSuggestions?.[index]).length > 0 && (
                <Checkbox
                  checked={
                    selectedSentence[index] === '' ||
                    selectedSentence[index] === undefined
                  }
                  onChange={() =>
                    handleSentenceSelect({
                      i: index,
                      key: '',
                      selectedSentence,
                    })
                  }
                />
              )}
            <TextArea
              style={{ marginLeft: 10, flex: 1 }}
              placeholder={`Enter point #${index + 1}`}
              onChange={(event) =>
                handleUpdateSendEmailPoints({
                  newPoint: event.target.value,
                  index,
                })
              }
              autoFocus
              autoSize
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleAddNewSendEmailPoint({
                    index,
                    sendEmailPoints,
                  });
                }
              }}
              value={point}
            />
            <div>
              {!sentenceSuggestionsLoading[index] ? (
                <UnorderedListOutlined
                  label='suggest alternatives'
                  style={{ color: 'lightgrey', marginLeft: 15, fontSize: 30 }}
                  onClick={() =>
                    handleClickSentenceSuggestions({
                      index,
                      sentenceSuggestionsLoading,
                    })
                  }
                />
              ) : (
                <LoadingOutlined
                  style={{ color: 'lightgrey', marginLeft: 15, fontSize: 30 }}
                />
              )}

              <PlusCircleOutlined
                color='green'
                style={{ marginLeft: 15, color: 'green', fontSize: 30 }}
                onClick={() =>
                  handleAddNewSendEmailPoint({
                    index,
                    sendEmailPoints,
                    sentenceSuggestionsLoading,
                  })
                }
              />
              <MinusCircleOutlined
                style={{ marginLeft: 15, color: 'lightgrey', fontSize: 30 }}
                onClick={() =>
                  handleRemoveSendEmailPoint({
                    index,
                    sendEmailPoints,
                    sentenceSuggestionsLoading,
                  })
                }
              />
            </div>
          </div>
        </FormItem>
        {sentenceSuggestions?.[index] !== undefined &&
          Object.values(sentenceSuggestions?.[index]).length > 0 && (
            <Table
              pagination={pagination}
              style={{ marginTop: 15, width: '100%', flex: 1 }}
              columns={sentenceSuggestionColumns}
              dataSource={Object.values(sentenceSuggestions?.[index])}
            />
          )}
      </div>
    );
  });
}

export default NewEmailPoint;
