describe("Accordion", () => {
  it("should show accodordion", () => {
    cy.visit("http://localhost:8080", {
      onBeforeLoad: (win) => {
        win.__mockedWidgetSdk = {
          settings: {
            123: {},
          },
          content: {
            123: '["<p>Accordion header</p>","<p>Accordion content</p>","<p>Header 2</p>","<p>Content 2</p>"]',
          },
        };
      },
    });

    cy.get("[data-testid=accordion-0-123-content]").should("not.be.visible");

    cy.get("[data-testid=accordion-0-123-header]").click();

    cy.get("[data-testid=accordion-0-123-content]").should("be.visible");

    cy.get("[data-testid=accordion-0-123-content]").contains(
      "Accordion content",
    );
  });
});
