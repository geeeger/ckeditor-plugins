function CompBase( owner, runtime ) {

    this.owner = owner;
    this.options = owner.options;

    this.getRuntime = function() {
        return runtime;
    };

    this.getRuid = function() {
        return runtime.uid;
    };

    this.trigger = function() {
        return owner.trigger.apply( owner, arguments );
    };
}

export default CompBase;
