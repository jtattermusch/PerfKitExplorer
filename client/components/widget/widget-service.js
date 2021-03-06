/**
 * @copyright Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @fileoverview widgetService is an angular service that provides
 * utility and management functions for operating on widgets.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.WidgetService');

goog.require('p3rf.perfkit.explorer.components.container.ContainerWidgetConfig');
goog.require('p3rf.perfkit.explorer.models.ChartType');
goog.require('p3rf.perfkit.explorer.models.WidgetConfig');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const ChartType = explorer.models.ChartType;
const WidgetConfig = explorer.models.WidgetConfig;



/**
 * See module docstring for more information about purpose and usage.
 *
 * @constructor
 */
explorer.components.widget.WidgetService = class {
  /** @ngInject */
  constructor(widgetFactoryService, chartWrapperService) {
    /** @export {string} */
    this.WIDGET_DELETE_WARNING = 'The widget will be deleted:\n\n';
    
    this.widgetFactorySvc = widgetFactoryService;
    
    this.chartWrapperSvc = chartWrapperService;
  };

  /**
   * Returns the delete warning for a widget.
   *
   * @param {!WidgetConfig} widget
   * @return {string}
   */
  getDeleteWarningMessage(widget) {
    let widgetName = '';
    
    if (widget.model.title) {
      widgetName = '\'' + widget.model.title + '\'';
    } else {
      widgetName = 'Untitled';
    }

    return this.WIDGET_DELETE_WARNING + widgetName;
  };

  /**
   * Copies an image of the current chart to the clipboard.
   * 
   * @param {!WidgetConfig} widget
   */
  copyAsImage(widget) {
    let chartWrapper = widget.state().chart.element;
    let chartObject = chartWrapper.getChart();

    let imageBuffer = document.getElementById('pk-chart-image-buffer');
    let sel = null;
    imageBuffer.src = chartObject.getImageURI();

    try {
      let range = document.createRange();
      range.selectNode(imageBuffer);

      sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);

      document.execCommand('copy');
    } finally {
      sel.removeAllRanges();
      imageBuffer.src = '';
    }
  }

  /**
   * Returns true if the widget is screenshottable, otherwise false.
   * @param {!WidgetConfig} widget
   * @return {boolean}
   * @export
   */
  isCopyableAsImage(widget) {
    if (widget.model.type === this.widgetFactorySvc.widgetTypes.CHART) {
      let chartType = this.chartWrapperSvc.allChartsIndex[widget.model.chart.chartType];
      goog.asserts.assert(
          goog.isDefAndNotNull(chartType),
          'Chart Type not valid: %s',
          [widget.model.chart.chartType]);

      if (chartType.canScreenshot === true) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Returns true if the widget is scrollable, otherwise false.
   * @param {!WidgetConfig} widget
   * @return {boolean}
   * @export
   */
  isScrollable(widget) {
    let container = widget.state().parent;

    // TODO: Replace with data-driven constraints for visualizations that support scrolling.
    if (container.model.container.scroll_overflow === true) {
      if (widget.model.type === this.widgetFactorySvc.widgetTypes.TEXT) {
        return true;
      }
      
      if (widget.model.type === this.widgetFactorySvc.widgetTypes.CHART) {
        switch (widget.model.chart.chartType) {
          case ChartType.TABLE:
            return true;
        }
      }
    }
      
    return false;
  }
};
const WidgetService = explorer.components.widget.WidgetService;


});  // goog.scope
