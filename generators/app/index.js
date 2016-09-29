'use strict';
var generators = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var path = require('path');
var guid = require('node-uuid');
var mkdirp = require('mkdirp');

module.exports = generators.Base.extend({

    prompting: function() {
        this.log(yosay(
            'Welcome to the slick ' + chalk.red.bold('Prodigious Helix') + ' generator!'
        ));

        console.log('INFO: .NET Framework 4.5');
        console.log('INFO: MVC 5.2.3');
        console.log('');
        console.log(chalk.red.bold('YOU MUST RUN THIS GENERATOR AS AN ADMINISTRATOR.'));
        console.log('');

        return this.prompt([{
            type: 'input',
            name: 'solutionName',
            message: 'Enter the name of your Solution:'
        }, {
            type: 'confirm',
            name: 'createTdsProject',
            message: 'Create TDS Master project?:',
            default: true
        }]).then(function(answers) {
            this.props = answers;
            this.props.projectGuid = '{' + guid.v4() + '}';
            this.props.configFolder = '{' + guid.v4() + '}';
            this.props.featureFolder = '{' + guid.v4() + '}';
            this.props.projectFolder = '{' + guid.v4() + '}';
            this.props.foundationFolder = '{' + guid.v4() + '}';
            this.props.solutionFolder = '{' + guid.v4() + '}';
            this.props.tdsGuid = guid.v4();
        }.bind(this));
    },
    writing: function() {
        var rootPath = path.join('');
        var codePath = path.join('src', 'Project', this.props.solutionName);

        // Create empty folders
        mkdirp.sync('lib/Sitecore');
        mkdirp.sync('src/Feature');
        mkdirp.sync('src/Foundation');

        // js config files
        this.fs.copy(
            this.templatePath('gulpfile.js'), this.destinationPath(path.join('gulpfile.js'))
        );

        this.fs.copy(
            this.templatePath('gulpfile-ci.js'), this.destinationPath(path.join('gulpfile-ci.js'))
        );

        this.fs.copyTpl(
            this.templatePath('gulp-config.js'),
            this.destinationPath(path.join('gulp-config.js')), {
                solutionName: this.props.solutionName
            }
        );

        // package.json file        
        this.fs.copyTpl(
            this.templatePath('package.json'),
            this.destinationPath(path.join('package.json')), {
                solutionName: this.props.solutionName
            }
        );

        // TDS Default configuration     
        this.fs.copyTpl(
            this.templatePath('TdsGlobal.config'),
            this.destinationPath(path.join('TdsGlobal.config')), {
                solutionName: this.props.solutionName
            }
        );

        // Publish targets main configuration file        
        this.fs.copyTpl(
            this.templatePath('publishsettings.targets'),
            this.destinationPath(path.join('publishsettings.targets')), {
                solutionName: this.props.solutionName
            }
        );

        // packages folder
        this.fs.copy(
            this.templatePath('packages/**/*'),
            this.destinationPath(path.join('packages'))
        );

        // code folder
        this.fs.copy(
            this.templatePath('code/**/*'),
            this.destinationPath(path.join(codePath, 'code'))
        );

        // csproj
        this.fs.copyTpl(
            this.templatePath('Sitecore.Project.csproj'),
            this.destinationPath(path.join(codePath, 'code', this.props.solutionName + '.Website.csproj')),
            this.props
        );

        // AssemblyInfo.cs, project
        this.fs.copyTpl(
            this.templatePath('AssemblyInfo.cs'),
            this.destinationPath(path.join(codePath, 'code', 'Properties', 'AssemblyInfo.cs')), { assemblyName: this.props.solutionName + '.Website.' }
        );

        // Publish Profile configuration
        this.fs.copyTpl(
            this.templatePath('Local.pubxml'),
            this.destinationPath(path.join(codePath, 'code', 'Properties/PublishProfiles', 'Local.pubxml')), { assemblyName: this.props.solutionName + '.Website.' }
        );

        // solution
        this.fs.copyTpl(
            this.templatePath('Solution.sln'),
            this.destinationPath(path.join(this.props.solutionName + '.sln')), {
                configFolder: this.props.configFolder,
                featureFolder: this.props.featureFolder,
                foundationFolder: this.props.foundationFolder,
                projectFolder: this.props.projectFolder,
                solutionFolder: this.props.solutionFolder,
                solutionName: this.props.solutionName,
                projectGuid: this.props.projectGuid,
                tdsGuid: this.props.tdsGuid
            }
        );

        // Project.Website.config
        this.fs.copyTpl(
            this.templatePath('Project.Website.config'),
            this.destinationPath(path.join(codePath, 'code', 'App_Config', 'Include/' + this.props.solutionName, this.props.solutionName + '.Website.config')),
            this.props
        );

        // z.Project.DevSettings.config
        this.fs.copyTpl(
            this.templatePath('z.Project.DevSettings.config'),
            this.destinationPath(path.join(codePath, 'code', 'App_Config', 'Include/' + this.props.solutionName, 'z.' + this.props.solutionName + '.DevSettings.config')),
            this.props
        );

        // TDS Project
        if (this.props.createTdsProject) {
            this.fs.copy(
                this.templatePath('tds/**/*'),
                this.destinationPath(path.join(codePath, 'tds'))
            );

            // tds csproj
            this.fs.copyTpl(
                this.templatePath('Tds.Master.scproj'),
                this.destinationPath(path.join(codePath,
                    'tds',
                    this.props.solutionName + '.Website.Master',
                    this.props.solutionName + '.Website.Master.scproj')),
                this.props
            );
        }
    },
    end: function() {
        console.log('');
        console.log('Solution name ' + chalk.red.bold(this.props.solutionName));
        console.log('Your Project module ' + chalk.red.bold(this.props.solutionName + '.Website') + ' has been created');
        console.log('');
        console.log('You will need to add your project(s) to your Visual Studio solution.');
        if (this.props.createTdsProject) {
            console.log('You will need to add your TDS project(s) to your Visual Studio solution.');
        }
        console.log('');
    }
});