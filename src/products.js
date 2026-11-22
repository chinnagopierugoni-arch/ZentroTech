export const zentroProducts = [
  {
    id: 'zentro-medicore',
    name: 'Zentro MediCore',
    category: 'Healthcare Technology',
    displayCategory: 'Hospital & Healthcare Management',
    tagline: 'One Connected Platform for Smarter Healthcare Operations.',
    description: 'Zentro MediCore is an integrated hospital and clinic management platform designed to simplify healthcare administration, patient management, clinical workflows and financial operations.',
    targets: ['Multi-speciality hospitals', 'Clinics', 'Diagnostic centres', 'Medical institutions', 'Healthcare networks'],
    benefits: ['Reduce administrative workload.', 'Centralise hospital information.', 'Improve patient coordination.', 'Simplify billing and reporting.', 'Improve operational visibility.'],
    modules: [
      ['Patient Management', ['Patient registration', 'Digital patient profiles', 'Medical history', 'Patient records', 'Patient visit history']],
      ['Appointment Management', ['Doctor availability', 'Appointment scheduling', 'Confirmation and rescheduling', 'Cancellation and queue management']],
      ['Doctor Management', ['Doctor profiles', 'Specialisations', 'Consultation schedules', 'Patient assignments', 'Doctor dashboards']],
      ['Electronic Medical Records', ['Medical records', 'Prescriptions', 'Diagnosis history', 'Lab reports', 'Document management']],
      ['Pharmacy Management', ['Medicine inventory', 'Stock management', 'Medicine billing', 'Expiry tracking']],
      ['Billing and Finance', ['Consultation and treatment billing', 'Payment tracking', 'Invoice generation', 'Financial reports']],
      ['Hospital Administration', ['Staff and department management', 'Bed and room management', 'Operational dashboards', 'Reports and analytics']]
    ],
    process: ['Requirements discovery', 'Workflow configuration', 'Data and system setup', 'Testing and training', 'Deployment and support'],
    deployment: 'Configurable hospital software with institution-specific workflows and modules.',
    faqs: [
      ['Can workflows be tailored for our hospital?', 'Yes. Institution-specific workflows and modules are discussed and agreed during requirements discovery.'],
      ['Does this page confirm that a particular hospital system is installed?', 'No. This is Zentro’s product offering; the final implementation scope is confirmed with the client.'],
      ['Can existing records be migrated?', 'Data migration can be considered for agreed sources after an assessment of format, quality and scope.']
    ]
  },
  {
    id: 'zentro-dineflow',
    name: 'Zentro DineFlow',
    category: 'Restaurant Technology',
    displayCategory: 'Restaurant Management System',
    tagline: 'Every Order. Every Table. Every Operation. Connected.',
    description: 'Zentro DineFlow is a restaurant management platform that connects digital menus, table reservations, customer orders, kitchen operations, billing and business analytics.',
    targets: ['Restaurants', 'Cafes', 'Hotels', 'Food courts', 'Cloud kitchens', 'Restaurant chains'],
    benefits: ['Faster order processing.', 'Better kitchen coordination.', 'Centralised restaurant operations.', 'Improved billing accuracy.', 'Better sales visibility.'],
    modules: [
      ['Digital Menu', ['QR-based menus', 'Food categories', 'Descriptions and images', 'Pricing', 'Availability controls']],
      ['Order Management', ['Dine-in, takeaway and delivery', 'Order status tracking', 'Order history']],
      ['Kitchen Display', ['Incoming order queue', 'Preparation status', 'Ready-to-serve notifications']],
      ['Table Management', ['Table availability', 'Table assignment', 'Reservation management', 'Occupancy']],
      ['Point of Sale', ['Billing', 'Discounts and taxes', 'Payment tracking', 'Digital receipts']],
      ['Inventory', ['Ingredient tracking', 'Stock updates', 'Low-stock alerts', 'Purchase records']],
      ['Business Analytics', ['Daily sales', 'Popular menu items', 'Revenue and order reports']]
    ],
    process: ['Restaurant discovery', 'Menu and workflow setup', 'POS and operations configuration', 'Validation and training', 'Single or multi-branch rollout'],
    deployment: 'Configurable single-restaurant and multi-branch deployments.',
    faqs: [
      ['Is DineFlow for one restaurant or a restaurant chain?', 'Both models can be discussed, with scope and deployment determined for the agreed operating structure.'],
      ['Can a restaurant payment provider be connected?', 'Payment options are subject to third-party integration scope and provider support.'],
      ['Can menus and tables be configured?', 'Yes. Menu categories, availability and operational tables are discussed during configuration.']
    ]
  },
  {
    id: 'zentro-bizerp',
    name: 'Zentro BizERP',
    category: 'Enterprise Software',
    displayCategory: 'Enterprise Resource Planning',
    tagline: 'Your Entire Business. One Intelligent Management System.',
    description: 'Zentro BizERP is an integrated enterprise resource planning solution that connects essential business operations in one configurable platform.',
    targets: ['Manufacturing companies', 'Distributors', 'Wholesalers', 'Retail businesses', 'Trading companies', 'Growing enterprises'],
    benefits: ['Connect multiple departments.', 'Improve inventory visibility.', 'Manage purchases and sales centrally.', 'Reduce manual processes.', 'Make informed business decisions.'],
    modules: [
      ['Inventory', ['Product catalogues', 'Stock tracking', 'Warehouse management', 'Stock transfers', 'Low-stock notifications']],
      ['Purchase', ['Supplier records', 'Purchase requests', 'Purchase orders', 'Goods receipt', 'Supplier payments']],
      ['Sales', ['Customer records', 'Sales orders', 'Quotations', 'Invoices', 'Sales tracking']],
      ['Finance', ['Income and expenses', 'Payment records', 'Accounts tracking', 'Financial summaries', 'Profit and loss reports']],
      ['Manufacturing', ['Production planning', 'Raw material tracking', 'Work orders', 'Production status', 'Finished goods']],
      ['Departments', ['Employee records', 'Department allocation', 'Responsibility management']],
      ['Analytics', ['Business performance', 'Sales and inventory reports', 'Purchase reports', 'Financial dashboards']]
    ],
    process: ['Operational review', 'Solution and module planning', 'ERP configuration', 'Migration and testing', 'Training and phased rollout'],
    deployment: 'Modular ERP implementation based on the customer’s business model.',
    faqs: [
      ['Can we start with only selected modules?', 'Yes. Required modules and a phased implementation scope can be agreed during planning.'],
      ['Can BizERP replace spreadsheets for our operation?', 'A suitable transition is discussed after understanding the records, workflows and reporting needs.'],
      ['Can we integrate our existing software?', 'Possible integrations are reviewed individually against the available APIs and agreed scope.']
    ]
  },
  {
    id: 'zentro-clientsphere',
    name: 'Zentro ClientSphere',
    category: 'Customer Management',
    displayCategory: 'Customer Relationship Management',
    tagline: 'Turn Every Customer Interaction into an Opportunity.',
    description: 'Zentro ClientSphere is a customer relationship management platform that helps organisations manage enquiries, leads, customer interactions, sales pipelines and business relationships.',
    targets: ['IT companies', 'SaaS businesses', 'Sales organisations', 'Real estate companies', 'Marketing agencies', 'Service providers'],
    benefits: ['Centralise customer information.', 'Improve lead follow-ups.', 'Track sales opportunities.', 'Improve team accountability.', 'Understand customer conversion.'],
    modules: [
      ['Lead Management', ['Lead capture', 'Lead profiles', 'Lead sources', 'Lead assignment', 'Status tracking']],
      ['Sales Pipeline', ['Custom sales stages', 'Opportunity tracking', 'Deal management', 'Conversion monitoring']],
      ['Follow-up Management', ['Follow-up schedules', 'Reminders', 'Interaction history', 'Task assignments']],
      ['Customer Management', ['Customer profiles', 'Contact information', 'Communication history', 'Segmentation']],
      ['Team Management', ['Sales representatives', 'Team assignments', 'Activity tracking', 'Performance reports']],
      ['Communication', ['Email integration where configured', 'Notification management', 'Communication logs']],
      ['Analytics', ['Lead conversion', 'Sales performance', 'Pipeline reports', 'Team productivity']]
    ],
    process: ['Sales process review', 'Pipeline and role configuration', 'CRM setup', 'Migration and validation', 'Team training and rollout'],
    deployment: 'Customisable CRM workflows for different industries.',
    faqs: [
      ['Can we define our own sales stages?', 'Yes. Custom sales stages are a configurable CRM requirement discussed during discovery.'],
      ['Can email be connected?', 'Email connection can be scoped when the required provider and integration are available.'],
      ['Can teams see only their assigned records?', 'Role and record visibility requirements can be included in the access-control design.']
    ]
  },
  {
    id: 'zentro-peoplecore',
    name: 'Zentro PeopleCore',
    category: 'Human Resource Technology',
    displayCategory: 'HR and Payroll Management',
    tagline: 'Empower Your Workforce. Simplify Every HR Process.',
    description: 'Zentro PeopleCore is an employee management platform designed to manage the employee lifecycle, attendance, leave, payroll and HR operations.',
    targets: ['Startups', 'SMEs', 'Enterprises', 'IT companies', 'Manufacturing organisations', 'Multi-branch businesses'],
    benefits: ['Centralised employee information.', 'Simplified HR administration.', 'More organised payroll processing.', 'Better workforce visibility.', 'Reduced manual HR work.'],
    modules: [
      ['Employee Management', ['Onboarding', 'Employee profiles', 'Department allocation', 'Job roles', 'Employee documents']],
      ['Attendance', ['Daily attendance', 'Check-in and check-out', 'Shift management', 'Attendance reports', 'Configurable integrations']],
      ['Leave', ['Applications', 'Approvals', 'Leave balances', 'Holiday calendars']],
      ['Payroll', ['Salary structures', 'Earnings and deductions', 'Payroll processing', 'Payslip generation', 'Payroll history']],
      ['Performance', ['Goals', 'Performance reviews', 'Appraisal records', 'Performance reports']],
      ['Recruitment', ['Job openings', 'Candidate records', 'Interview scheduling', 'Recruitment pipeline']],
      ['HR Analytics', ['Employee statistics', 'Attendance summaries', 'Payroll reports', 'Workforce analytics']]
    ],
    process: ['Policy and process review', 'HR workflow configuration', 'Employee and payroll setup', 'Validation and training', 'Deployment and support'],
    deployment: 'Configurable HR workflows based on company policies.',
    faqs: [
      ['Can attendance rules be customised?', 'Shift, leave and attendance rules can be configured around the policies agreed during discovery.'],
      ['Can payroll include our organisation’s salary structures?', 'Custom salary structures can be scoped against the applicable payroll requirements.'],
      ['Can existing employee records be imported?', 'Existing data migration is possible when the source format and data quality are suitable.']
    ]
  },
  {
    id: 'zentro-commercex',
    name: 'Zentro CommerceX',
    category: 'E-commerce Technology',
    displayCategory: 'E-commerce Platform',
    tagline: 'Build. Sell. Manage. Grow Your Digital Business.',
    description: 'Zentro CommerceX enables businesses to launch and manage their own branded online stores with product catalogues, shopping carts, payments and order operations.',
    targets: ['Retail businesses', 'D2C brands', 'Manufacturers', 'Wholesale businesses', 'Startups', 'Online sellers'],
    benefits: ['Launch a branded online store.', 'Manage products and orders centrally.', 'Connect payment and delivery workflows.', 'Monitor store performance.', 'Expand digital sales channels.'],
    modules: [
      ['Store Builder', ['Custom storefront', 'Brand identity', 'Homepage management', 'Category pages', 'Responsive layouts']],
      ['Product Management', ['Product listings', 'Descriptions and images', 'Pricing', 'Variants and stock']],
      ['Shopping Experience', ['Shopping cart', 'Wishlist', 'Customer accounts where configured', 'Checkout', 'Order confirmation']],
      ['Payments', ['Gateway integrations', 'Payment status', 'Transaction records', 'Refund workflows where supported']],
      ['Order Management', ['Processing', 'Status updates', 'Shipping information', 'Delivery integrations', 'Returns']],
      ['Customers', ['Customer profiles', 'Purchase history', 'Enquiries', 'Customer communication']],
      ['Analytics', ['Sales reports', 'Product performance', 'Order analytics', 'Revenue summaries']]
    ],
    process: ['Store requirements discovery', 'Brand and catalogue setup', 'Payment and delivery configuration', 'Store testing', 'Launch and maintenance'],
    deployment: 'Custom branded e-commerce storefronts and business-specific configurations.',
    faqs: [
      ['Can Zentro build our branded storefront?', 'Store branding and pages can be configured within an agreed implementation scope.'],
      ['Which payment gateways are supported?', 'Providers are reviewed during discovery and integrated only when suitable and agreed.'],
      ['Can delivery providers be connected?', 'Delivery integrations can be scoped according to provider APIs and operational requirements.']
    ]
  },
  {
    id: 'zentro-automind-ai',
    name: 'Zentro AutoMind AI',
    category: 'Artificial Intelligence',
    displayCategory: 'AI and Business Process Automation',
    tagline: 'Automate Repetitive Work. Accelerate Intelligent Business.',
    description: 'Zentro AutoMind AI is an automation solution designed to help businesses streamline repetitive tasks, automate workflows and connect business applications.',
    targets: ['SMEs', 'Enterprises', 'Customer support teams', 'Sales teams', 'E-commerce companies', 'IT and service organisations'],
    benefits: ['Reduce repetitive work.', 'Improve operational efficiency.', 'Connect business systems.', 'Accelerate enquiry handling.', 'Create consistent business workflows.'],
    modules: [
      ['AI Assistants', ['Configurable assistants', 'Knowledge-based responses', 'Customer enquiry handling', 'Internal support assistance']],
      ['Workflow Automation', ['Trigger-based workflows', 'Task automation', 'Approval processes', 'Automated notifications']],
      ['Support Automation', ['Chatbot workflows', 'FAQ assistance', 'Enquiry capture', 'Human handoff']],
      ['Lead Automation', ['Lead capture', 'Categorisation', 'Routing', 'Follow-up triggers']],
      ['Document Automation', ['Document processing', 'Data extraction where supported', 'Classification', 'Structured information']],
      ['Integrations', ['APIs', 'Webhooks', 'Third-party integrations', 'Data synchronisation']],
      ['Automation Analytics', ['Execution history', 'Task status', 'Error monitoring', 'Performance reports']]
    ],
    process: ['Process and automation review', 'Scope and AI boundary confirmation', 'Workflow implementation', 'Validation and monitoring setup', 'Controlled rollout'],
    deployment: 'AI and automation workflows designed around each customer’s actual processes.',
    faqs: [
      ['Which AI features are already implemented?', 'AI features shown are configurable solution capabilities. Implemented models and integrations are confirmed separately for each agreed deployment.'],
      ['Can AutoMind AI connect to our existing applications?', 'Integrations are planned after reviewing APIs, webhooks and data requirements.'],
      ['Does the system make decisions automatically?', 'Automation boundaries, approvals and human review steps are defined during requirements and solution design.']
    ]
  },
  {
    id: 'zentro-flexsuite',
    name: 'Zentro FlexSuite',
    category: 'Custom Software',
    displayCategory: 'Custom Business Software Development',
    tagline: 'Your Business Requirements. Engineered into Software.',
    description: 'Zentro FlexSuite is a custom software offering for organisations that need platforms tailored to their internal operations, industry requirements and business processes.',
    targets: ['Startups', 'SMEs', 'Enterprises', 'Manufacturing companies', 'Educational organisations', 'Healthcare organisations'],
    benefits: ['Software designed around actual requirements.', 'Flexible business workflows.', 'Better operational control.', 'Integration with existing systems.', 'Scalable software architecture.'],
    modules: [
      ['Custom Dashboards', ['Business-specific dashboards', 'Role-based interfaces', 'Department dashboards', 'Management reporting']],
      ['Custom Workflows', ['Approvals', 'Task automation', 'Process management', 'Custom notifications']],
      ['Data Management', ['Database design', 'Data migration', 'Structured records', 'Reporting systems']],
      ['Applications', ['Web applications', 'Mobile applications', 'Internal portals', 'Enterprise systems']],
      ['Integrations', ['API integrations', 'Third-party applications', 'Existing software connections', 'Data synchronisation']],
      ['Analytics', ['Custom reports', 'Operational metrics', 'Performance dashboards', 'Data visualisation']],
      ['Support', ['Updates', 'Technical support', 'Feature enhancements', 'System maintenance']]
    ],
    process: ['Requirement discovery', 'Solution architecture', 'Focused development', 'Testing and deployment', 'Maintenance and enhancement'],
    deployment: 'Requirement discovery, solution architecture, development, testing, deployment and ongoing maintenance.',
    faqs: [
      ['Do you build web and mobile applications?', 'Web and mobile development are available as scoped custom software capabilities.'],
      ['Can FlexSuite replace multiple disconnected tools?', 'A consolidation proposal depends on a review of the existing tools, data and workflows.'],
      ['Can you maintain the platform after launch?', 'Ongoing updates and technical support can be agreed separately from initial development.']
    ]
  },
  {
    id: 'zentro-educore',
    name: 'Zentro EduCore',
    category: 'Education Technology',
    displayCategory: 'White-Label LMS and CRM Platform',
    tagline: 'Your Institution. Your Brand. Your Complete Learning Ecosystem.',
    description: 'Zentro EduCore is a configurable, white-label education platform for EdTech companies, coaching institutes, training organisations and educational institutions.',
    targets: ['EdTech companies', 'Coaching institutes', 'Online learning companies', 'Universities and colleges', 'Corporate training providers', 'Skill development organisations'],
    benefits: ['Launch an institution-branded learning platform.', 'Avoid building an LMS from scratch.', 'Combine LMS and CRM operations.', 'Customise the platform around the organisation.', 'Receive installation and technical support from Zentro.'],
    modules: [
      ['Learning Management', ['Course creation', 'Course categories', 'Video lessons', 'Learning materials', 'Assignments', 'Assessments', 'Progress tracking', 'Certificates']],
      ['Student Management', ['Student profiles', 'Enrolments', 'Batch allocation', 'Attendance', 'Progress and performance']],
      ['Education CRM', ['Enquiry management', 'Lead capture', 'Admission pipeline', 'Counsellor assignments', 'Follow-up reminders', 'Conversion reports']],
      ['Faculty Management', ['Faculty profiles', 'Instructor dashboards', 'Course assignments', 'Schedules', 'Evaluation']],
      ['Examination Management', ['Online tests', 'Question banks', 'Assessment results', 'Performance reports', 'Configurable workflows']],
      ['Fees and Payments', ['Course fees', 'Payment records', 'Outstanding balances', 'Gateway integrations', 'Receipts']],
      ['White-Label Customisation', ['Institution logo', 'Brand colours', 'Custom name', 'Domain or subdomain', 'Branded login', 'Custom dashboards']],
      ['Admin and Analytics', ['Student analytics', 'Course performance', 'Admission reports', 'Revenue summaries', 'Role management', 'Activity monitoring']],
      ['Customisation and Integration', ['Custom modules', 'Business workflows', 'API integrations', 'Data migration', 'Third-party integrations', 'Custom reports']]
    ],
    process: ['Client enquiry', 'Requirements discovery', 'Package selection', 'Brand and platform configuration', 'Agreed integration and migration', 'Testing and training', 'Deployment', 'Maintenance and support'],
    deployment: 'Starter, Professional or Enterprise white-label deployment scoped around the agreed requirements.',
    packages: [
      ['Starter', ['Core LMS', 'Student and course management', 'Basic CRM', 'Standard branding', 'Essential reports']],
      ['Professional', ['All Starter features', 'Advanced CRM', 'Faculty management', 'Assessment management', 'Custom dashboards', 'Additional integrations']],
      ['Enterprise', ['All Professional features', 'Advanced customisation', 'Multi-branch or multi-campus support', 'Advanced analytics', 'Custom workflows', 'Dedicated deployment options', 'Priority support']]
    ],
    faqs: [
      ['Can EduCore launch under our institution brand?', 'Branding options can be scoped and included in a selected package. Custom domains and multi-tenancy are implemented only through an agreed and tested deployment.'],
      ['Can existing education data be migrated?', 'Migration can be considered after reviewing the source data, format and agreed scope.'],
      ['What package should we choose?', 'Zentro reviews the organisation’s LMS, CRM, size and integration requirements before recommending a package.'],
      ['How much does EduCore cost?', 'Fixed prices are not published. Pricing depends on the package and agreed implementation scope.']
    ]
  }
];

export const demoProducts = zentroProducts.map(product => ({
  id: product.id,
  name: product.name,
  category: product.category,
  description: product.description,
  features: product.benefits.slice(0, 4)
}));
