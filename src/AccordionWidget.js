import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import widgetSDK from "@happeo/widget-sdk";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

import { Tooltip } from "@happeouikit/tooltip";
import { IconChevronRight, IconAdd, IconDelete } from "@happeouikit/icons";
import { padding300, margin300, margin200 } from "@happeouikit/layout";
import { ButtonSecondary, IconButton } from "@happeouikit/buttons";
import { gray08, gray09 } from "@happeouikit/colors";
import { ContentRenderer } from "@happeouikit/content-renderer";
import { WIDGET_SETTINGS } from "./constants";
import {
  divideDataIntoRows,
  parseStringJSON,
  getContentFromFroala,
  getContentFromFroalaInstance,
} from "./utils";

const EditRow = ({
  item,
  settings,
  index,
  onItemUpdated,
  removeRow,
  pageId,
}) => {
  const [initialContent] = useState(item[1]);
  return (
    <>
      <EditableAccordionTitle
        style={{ backgroundColor: settings?.headerBackgroundColor }}
      >
        <IconChevronRight
          className="accordion__icon--expand"
          width={24}
          height={24}
          style={{ marginRight: margin300, flexShrink: 0 }}
        />
        <widgetSDK.uikit.RichTextEditor
          type="full"
          placeholder="Add title"
          content={item[0]}
          onContentChanged={() => onItemUpdated(index, 0)}
          imageUploadLocation={{
            name: "page",
            id: pageId,
          }}
        />
        <IconButton
          icon={IconDelete}
          onMouseDown={() => removeRow(index)}
          type="alert"
          isActionIcon
          aria-label="Remove row"
          data-tip={"Remove row"}
          data-for={`${index}-tooltip`}
        />
        <Tooltip id={`${index}-tooltip`} />
      </EditableAccordionTitle>
      <EditableAccordionContent
        style={{ backgroundColor: settings?.contentBackgroundColor }}
      >
        <widgetSDK.uikit.RichTextEditor
          type="full"
          placeholder="Add content"
          content={initialContent}
          onContentChanged={() => onItemUpdated(index, 1)}
          imageUploadLocation={{
            name: "page",
            id: pageId,
          }}
        />
      </EditableAccordionContent>
    </>
  );
};

const AccordionWidget = ({ id, editMode }) => {
  const editRef = useRef();
  const [initialized, setInitialized] = useState(false);
  const [items, setItems] = useState([]);
  const [settings, setSettings] = useState({});
  const [widgetApi, setWidgetApi] = useState();
  const [pageId, setPageId] = useState();

  useEffect(() => {
    const doInit = async () => {
      // Init API, use uniqueId for the initialisation as this widget may be present multiple times in a page
      const api = await widgetSDK.api.init(id);

      // After init, declare settings that are displayed to the user, add setSettings as the callback
      api.declareSettings(WIDGET_SETTINGS, setSettings);

      /**
       * Get widget content. This is stringified array
       * We use a pure array to store data since content field is indexed directly
       * and array poses the lease amount of unnecessary data to the index. As an
       * example, if this would be an object, the object keys would be indexed and
       * searchable
       */
      const widgetContent = await api.getContent();
      const parsedContent = parseStringJSON(widgetContent, []);
      const dividedContent = divideDataIntoRows(parsedContent);
      const context = await api.getContext();
      setPageId(context?.location?.pageId);
      setItems(dividedContent);
      setWidgetApi(api);
      setInitialized(true);

      if (editMode && parsedContent.length === 0) {
        addRow();
      }
    };
    doInit();
  }, [editMode, id]);

  const onItemUpdated = useCallback((rowIndex, indexInRow) => {
    setItems((oldItems) =>
      oldItems.map((item, i) => {
        if (i !== rowIndex) {
          return item;
        }
        const newItem = [...item];
        newItem[indexInRow] = getContentFromFroalaInstance(
          editRef.current,
          rowIndex,
          indexInRow
        );
        return newItem;
      })
    );
  }, []);

  const removeRow = useCallback((rowIndex) => {
    setItems((oldItems) => oldItems.filter((_, i) => i !== rowIndex));
  }, []);

  const addRow = useCallback(() => {
    setItems((prevItems) => [...prevItems, ["", ""]]);
  }, []);

  useEffect(() => {
    // we need to keep widget content in sync when items
    // are added or removed during editing
    if (editMode && editRef.current) {
      const data = getContentFromFroala(editRef.current);
      widgetApi.setContent(JSON.stringify(data));
    }
  }, [items]);

  if (!initialized) {
    // We don't want to show any loaders
    return null;
  }
  return (
    <widgetSDK.uikit.ProviderWrapper>
      <Container>
        {/* className "custom-font-styles" targets pages custom styles to the components below */}
        <div className="custom-font-styles">
          {editMode ? (
            <widgetSDK.uikit.ProviderWrapper>
              <div ref={editRef}>
                {items.map((item, index) => (
                  <EditRow
                    key={index}
                    item={item}
                    index={index}
                    onItemUpdated={onItemUpdated}
                    removeRow={removeRow}
                    settings={settings}
                    pageId={pageId}
                  />
                ))}
              </div>
            </widgetSDK.uikit.ProviderWrapper>
          ) : (
            <Accordion
              allowMultipleExpanded
              allowZeroExpanded
              settings={settings}
            >
              {items.map((item, index) => (
                <AccordionItem key={index}>
                  <AccordionItemHeading>
                    <AccordionItemButton
                      style={{
                        backgroundColor: settings?.headerBackgroundColor,
                      }}
                    >
                      <IconChevronRight
                        className="accordion__icon--expand"
                        width={24}
                        height={24}
                        style={{ marginRight: margin300, flexShrink: 0 }}
                      />

                      <div className="custom-font-styles fr-view pages-text">
                        <ContentRenderer content={item[0]} type="html" />
                      </div>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel
                    style={{
                      backgroundColor: settings?.contentBackgroundColor,
                    }}
                  >
                    <div className="custom-font-styles fr-view pages-text">
                      <ContentRenderer content={item[1]} type="html" />
                    </div>
                  </AccordionItemPanel>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
        {editMode && (
          <ButtonSecondary
            style={{ marginTop: margin200 }}
            text="New item"
            icon={IconAdd}
            onClick={addRow}
          />
        )}
      </Container>
    </widgetSDK.uikit.ProviderWrapper>
  );
};

const Container = styled.div`
  .accordion__button {
    cursor: pointer;
    padding: ${padding300};
    background-color: ${gray08};
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    &[aria-expanded="true"] {
      .accordion__icon--expand {
        transform: rotate(90deg);
      }
    }
    .accordion__icon--expand {
      transition: transform 120ms ease-in-out;
    }
    h1,
    h2,
    h3,
    p {
      margin-bottom: 0;
    }
  }
  .accordion__panel {
    padding: ${padding300};
    background-color: ${gray09};
  }
`;
const EditableAccordionTitle = styled.div`
  padding: ${padding300};
  display: flex; 
  flex-wrap; nowrap;
  align-items: center;
  background-color: ${gray08};
  .accordion__icon--expand {
    transform: rotate(90deg);
  }
  h1, h2, h3, p {
    margin-bottom: 0;
  }
`;
const EditableAccordionContent = styled.div`
  padding: ${padding300};
  background-color: ${gray09};
`;

export default AccordionWidget;
