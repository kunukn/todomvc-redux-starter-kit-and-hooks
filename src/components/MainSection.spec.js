import React from "react";
import { createRenderer } from "react-test-renderer/shallow";
import MainSection from "./MainSection";
import Footer from "./Footer";
import TodoList from "../components/TodoList";

const setup = propOverrides => {
  const props = Object.assign(
    {
      todosCount: 2,
      completedCount: 1,
      actions: {
        edit: jest.fn(),
        delete: jest.fn(),
        complete: jest.fn(),
        completeAll: jest.fn(),
        clearCompleted: jest.fn()
      }
    },
    propOverrides
  );

  const renderer = createRenderer();
  renderer.render(<MainSection {...props} />);
  const output = renderer.getRenderOutput();

  return {
    props: props,
    output: output,
    renderer: renderer
  };
};

describe("components", () => {
  describe("MainSection", () => {
    it("should render container", () => {
      const { output } = setup();
      expect(output.type).toBe("section");
      expect(output.props.className).toBe("main");
    });

    describe("toggle all input", () => {
      it("should render", () => {
        const { output } = setup();
        const [toggle] = output.props.children[0].props.children;
        expect(toggle.type).toBe("input");
        expect(toggle.props.className).toBe("toggle-all");
        expect(toggle.props.type).toBe("checkbox");
        expect(toggle.props.checked).toBe(false);
      });

      it("should be checked if all todos completed", () => {
        const { output } = setup({
          completedCount: 2
        });
        const [toggle] = output.props.children[0].props.children;
        expect(toggle.props.checked).toBe(true);
      });

      it("should call completeAllTodos on change", () => {
        const { output, props } = setup();
        const [, label] = output.props.children[0].props.children;
        label.props.onClick({});
        expect(props.actions.completeAll).toBeCalled();
      });
    });

    describe("footer", () => {
      it("should render", () => {
        const { output } = setup();
        const [, , footer] = output.props.children;
        expect(footer.type).toBe(Footer);
        expect(footer.props.completedCount).toBe(1);
        expect(footer.props.activeCount).toBe(1);
      });

      it("onClearCompleted should call clearCompleted", () => {
        const { output, props } = setup();
        const [, , footer] = output.props.children;
        footer.props.onClearCompleted();
        expect(props.actions.clearCompleted).toBeCalled();
      });
    });

    describe("visible todo list", () => {
      it("should render", () => {
        const { output } = setup();
        const [, visibleTodoList] = output.props.children;
        expect(visibleTodoList.type).toBe(VisibleTodoList);
      });
    });

    describe("toggle all input and footer", () => {
      it("should not render if there are no todos", () => {
        const { output } = setup({
          todosCount: 0,
          completedCount: 0
        });
        const renderedChildren = output.props.children.filter(
          item => item !== false
        );
        expect(renderedChildren.length).toBe(1);
        expect(renderedChildren[0].type).toBe(TodoList);
      });
    });
  });
});
