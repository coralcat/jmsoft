google.charts.load('current', {packages:["orgchart"]});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Name');
    data.addColumn('string', 'Manager');
    data.addColumn('string', 'ToolTip');

    // For each orgchart box, provide the name, manager, and tooltip to show.
    data.addRows([
        [{'v':'대표이사', 'f':'대표이사<div style="color:#36299f; font-style:italic">CEO</div>'},
            '', 'CEO'],
        [{'v':'시스템 사업부', 'f':'시스템 사업부<div style="color:#3b9cff; font-style:italic">Hardware Division</div>'},
            '대표이사', ''],
        [{'v':'소프트웨어 사업부', 'f':'소프트웨어 사업부<div style="color:#3b9cff; font-style:italic">Software Division</div>'},
            '대표이사', ''],
        [{'v':'경영지원', 'f':'경영지원<div style="color:#3b9cff; font-style:italic">Human Resources</div>'},
            '대표이사', ''],
        [{'v':'CS', 'f':'CS<div style="color:#3b9cff; font-style:italic">Customer Services</div>'},
            '대표이사', ''],
        [{'v':'시스템 컨설팅', 'f':'시스템 컨설팅<br />국내/해외 영업'},
            '시스템 사업부', ''],
        [{'v':'소프트웨어 사업부 업무', 'f':'IIoT 솔루션<br />지능형 RCS 솔루션<br />CIM / RTMS<br />SI(Web, 모바일)'},
            '소프트웨어 사업부', ''],
        [{'v':'CS 업무', 'f':'현장 Setup<br />기술지원(CS)<br />장애 대응'},
            'CS', ''],



    ]);

    // Create the chart.
    var chart = new google.visualization.OrgChart(document.getElementById('organizationChart'));
    // Draw the chart, setting the allowHtml option to true for the tooltips.
    chart.draw(data, {'allowHtml':true});
}